// ==============================================================================
// VALIXEN FINANCIAL ACCOUNT SERVICE
// Manages Smart Checking, High-Yield Vaults & Multi-Asset Balances
// ==============================================================================

import { db } from '@/lib/db';
import { AccountType, AccountStatus, AuditAction } from '@prisma/client';
import { NotFoundError, InsufficientFundsError } from '@/lib/api/errors';
import { AuditService } from './audit.service';
import { Prisma } from '@prisma/client';

export class AccountService {
  /**
   * Generates a collision-resistant international account number
   */
  private static generateAccountNumber(): string {
    const prefix = 'VLX';
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    return `${prefix}${randomDigits}`;
  }

  /**
   * Retrieves all active accounts belonging to a user
   */
  public static async getUserAccounts(userId: string) {
    return db.financialAccount.findMany({
      where: { userId, status: { not: AccountStatus.CLOSED } },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Creates a new smart account or high-yield vault
   */
  public static async createAccount(params: {
    userId: string;
    accountName: string;
    type: AccountType;
    currency?: string;
  }) {
    const account = await db.financialAccount.create({
      data: {
        userId: params.userId,
        accountName: params.accountName,
        accountNumber: this.generateAccountNumber(),
        type: params.type,
        currency: params.currency || 'USD',
        balance: new Prisma.Decimal(0),
        availableBalance: new Prisma.Decimal(0),
      },
    });

    await AuditService.recordEvent({
      userId: params.userId,
      action: AuditAction.API_KEY_GENERATED,
      resourceEntity: 'FinancialAccount',
      resourceId: account.id,
      details: { accountType: params.type, currency: account.currency },
    });

    return account;
  }

  /**
   * Transfers funds between accounts atomically with database transaction isolation
   */
  public static async transferFunds(params: {
    userId: string;
    sourceAccountId: string;
    destinationAccountId: string;
    amount: number;
    description?: string;
  }) {
    const amountDecimal = new Prisma.Decimal(params.amount);

    return db.$transaction(async (tx) => {
      const source = await tx.financialAccount.findUnique({
        where: { id: params.sourceAccountId },
      });

      if (!source || source.userId !== params.userId) {
        throw new NotFoundError('Source Financial Account', params.sourceAccountId);
      }

      if (source.availableBalance.lessThan(amountDecimal)) {
        throw new InsufficientFundsError(
          `Insufficient available balance in account ${source.accountNumber}. Required: ${params.amount}, Available: ${source.availableBalance}`
        );
      }

      const destination = await tx.financialAccount.findUnique({
        where: { id: params.destinationAccountId },
      });

      if (!destination) {
        throw new NotFoundError('Destination Financial Account', params.destinationAccountId);
      }

      // Debit source account
      await tx.financialAccount.update({
        where: { id: source.id },
        data: {
          balance: { decrement: amountDecimal },
          availableBalance: { decrement: amountDecimal },
        },
      });

      // Credit destination account
      await tx.financialAccount.update({
        where: { id: destination.id },
        data: {
          balance: { increment: amountDecimal },
          availableBalance: { increment: amountDecimal },
        },
      });

      // Record immutable double-entry ledger transaction
      const referenceNumber = `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

      const transaction = await tx.transaction.create({
        data: {
          sourceAccountId: source.id,
          destinationAccountId: destination.id,
          type: 'INTERNAL_TRANSFER',
          status: 'COMPLETED',
          amount: amountDecimal,
          currency: source.currency,
          referenceNumber,
          description: params.description || 'Internal portfolio rebalance',
          settledAt: new Date(),
        },
      });

      return transaction;
    });
  }
}
