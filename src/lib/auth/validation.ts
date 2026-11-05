// ==============================================================================
// VALIXEN AUTH VALIDATION SCHEMAS (ZOD ENTERPRISE VALIDATION)
// Strict password complexity, sanitization, and security constraints
// ==============================================================================

import { z } from 'zod';

export const PasswordComplexityRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/;

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid institutional or personal email address.')
      .max(255, 'Email cannot exceed 255 characters.'),
    password: z
      .string()
      .min(10, 'Password must be at least 10 characters long.')
      .max(128, 'Password cannot exceed 128 characters.')
      .regex(
        PasswordComplexityRegex,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special symbol.'
      ),
    confirmPassword: z.string(),
    firstName: z.string().trim().min(1, 'First name is required.').max(64).optional(),
    lastName: z.string().trim().min(1, 'Last name is required.').max(64).optional(),
    acceptTerms: z.boolean().refine((val: boolean) => val === true, {
      message: 'You must accept the Valixen Terms of Service and Privacy Policy.',
    }),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address.')
    .max(255),
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean().optional().default(false),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address.')
    .max(255),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(32, 'Invalid or expired password reset token.'),
    password: z
      .string()
      .min(10, 'Password must be at least 10 characters long.')
      .max(128)
      .regex(
        PasswordComplexityRegex,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special symbol.'
      ),
    confirmPassword: z.string(),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const VerifyEmailSchema = z.object({
  token: z.string().min(32, 'Invalid or expired verification token.'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
