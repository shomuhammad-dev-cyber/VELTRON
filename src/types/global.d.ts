// ==============================================================================
// VALIXEN GLOBAL TYPE DECLARATIONS & AMBIENT SHIMS
// ==============================================================================

/* eslint-disable @typescript-eslint/no-explicit-any */

namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface Element {
    [elemName: string]: any;
    children: any;
    type: any;
    props: any;
    key: any;
  }
}

namespace React {
  export type ReactNode = any;
  export type ReactElement<P = any, T = any> = any;
  export type FC<P = any> = (props: P) => any;
  export type FunctionComponent<P = any> = (props: P) => any;
  export type HTMLAttributes<T = any> = any;
  export type ButtonHTMLAttributes<T = any> = any;
  export type InputHTMLAttributes<T = any> = any;
  export type FormEvent<T = any> = any;
  export type ChangeEvent<T = any> = any;
  export type MouseEvent<T = any> = any;
  export type MouseEventHandler<T = any> = any;
  export type ChangeEventHandler<T = any> = any;
  export type ComponentType<P = any> = any;
  export type PropsWithChildren<P = any> = P & { children?: any };
  export type Key = string | number | bigint;
  export type CSSProperties = any;
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element {
      [elemName: string]: any;
      children: any;
      type: any;
      props: any;
      key: any;
    }
  }
}

declare module 'react' {
  export type ReactNode = any;
  export type ReactElement<P = any, T = any> = any;
  export type FC<P = any> = (props: P) => any;
  export type FunctionComponent<P = any> = (props: P) => any;
  export type HTMLAttributes<T = any> = any;
  export type ButtonHTMLAttributes<T = any> = any;
  export type InputHTMLAttributes<T = any> = any;
  export type FormEvent<T = any> = any;
  export type ChangeEvent<T = any> = any;
  export type MouseEvent<T = any> = any;
  export type MouseEventHandler<T = any> = any;
  export type ChangeEventHandler<T = any> = any;
  export type ComponentType<P = any> = any;
  export type PropsWithChildren<P = any> = P & { children?: any };
  export type Key = string | number | bigint;
  export type CSSProperties = any;
  export function useState<T = any>(initialState?: T | (() => T)): [T, (newState: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useRef<T = any>(initialValue?: T | null): { current: T | null };
  export function useMemo<T = any>(factory: () => T, deps?: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps?: any[]): T;
  export function forwardRef<T = any, P = any>(render: (props: P, ref: any) => any): ((props: P & { ref?: any }) => any) & { displayName?: string };
  export const Fragment: any;
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element {
      [elemName: string]: any;
      children: any;
      type: any;
      props: any;
      key: any;
    }
  }
  const React: {
    useState: typeof useState;
    useEffect: typeof useEffect;
    useRef: typeof useRef;
    useMemo: typeof useMemo;
    useCallback: typeof useCallback;
    forwardRef: typeof forwardRef;
    Fragment: any;
    [key: string]: any;
  };
  export default React;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element {
      [elemName: string]: any;
      children: any;
      type: any;
      props: any;
      key: any;
    }
  }
}

declare module 'next' {
  export type Metadata = any;
  export type Viewport = any;
  const Next: any;
  export default Next;
}

declare module 'next/link' {
  const Link: any;
  export default Link;
}

declare module 'next/dynamic' {
  const dynamic: any;
  export default dynamic;
}

declare module 'next/server' {
  export class NextResponse extends Response {
    constructor(body?: any, init?: any);
    static json(data: any, init?: any): NextResponse;
    static next(init?: any): NextResponse;
    static redirect(url: string | URL, init?: any): NextResponse;
    headers: any;
    status: number;
    [key: string]: any;
  }
  export type NextRequest = any;
}

declare module '@prisma/client' {
  export * from '@/types/database';
  export class PrismaClient {
    constructor(options?: any);
    financialAccount: any;
    portfolio: any;
    virtualTrade: any;
    portfolioHolding: any;
    auditLog: any;
    transaction: any;
    user: any;
    userProfile: any;
    account: any;
    session: any;
    verificationToken: any;
    passwordResetToken: any;
    watchlist: any;
    notification: any;
    subscription: any;
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $transaction(fn: (tx: any) => Promise<any>): Promise<any>;
    $queryRaw(query: any, ...values: any[]): Promise<any>;
    $on(event: string, callback: (...args: any[]) => void): void;
  }
  export namespace Prisma {
    export class Decimal {
      constructor(value: any);
      times(value: any): Decimal;
      plus(value: any): Decimal;
      minus(value: any): Decimal;
      dividedBy(value: any): Decimal;
      toNumber(): number;
    }
  }
}

declare module 'zod' {
  export namespace z {
    export type infer<T> = any;
    export type ZodType<T = any> = any;
  }
  export const z: any;
  export class ZodError {
    issues: any[];
    errors: any[];
  }
  const defaultExport: any;
  export default defaultExport;
}

declare module 'lucide-react' {
  export const ShieldCheck: any;
  export const Activity: any;
  export const Terminal: any;
  export const TrendingUp: any;
  export const Shield: any;
  export const Cpu: any;
  export const Brain: any;
  export const Zap: any;
  export const ArrowUpRight: any;
  export const ArrowRight: any;
  export const ArrowLeft: any;
  export const ChevronRight: any;
  export const Database: any;
  export const Lock: any;
  export const Layers: any;
  export const Sparkles: any;
  export const Loader2: any;
  export const BarChart2: any;
  export const Mail: any;
  export const MailCheck: any;
  export const User: any;
  export const UserCheck: any;
  export const AlertCircle: any;
  export const AlertTriangle: any;
  export const CheckCircle: any;
  export const CheckCircle2: any;
  export const KeyRound: any;
  export const ShieldAlert: any;
  export const LogOut: any;
  export const Smartphone: any;
  export const Laptop: any;
  export const Globe: any;
  export const Wallet: any;
  export const Search: any;
  export const Settings: any;
  export const Bell: any;
  export const Eye: any;
  export const EyeOff: any;
  export const RefreshCw: any;
  export const Copy: any;
  export const ExternalLink: any;
  export const Info: any;
  export const DollarSign: any;
  export const TrendingDown: any;
  export const ArrowDownRight: any;
  export const Plus: any;
  export const Send: any;
  export const Download: any;
  export const SlidersHorizontal: any;
  export const Calendar: any;
  export const ChevronDown: any;
  export const Menu: any;
  export const X: any;
  export const Clock: any;
  export const CreditCard: any;
  export const Target: any;
  export const Filter: any;
  export const Check: any;
  export const Star: any;
  export const Coins: any;
  export const HelpCircle: any;
  export const RotateCcw: any;
  export const BookOpen: any;
  export const PieChart: any;
  export const History: any;
  export const Wifi: any;
  export const Trash2: any;
  export const Landmark: any;
  export const Building2: any;
  export const FileText: any;
  export const ArrowUpDown: any;
  export const FileDown: any;
  export const ChevronLeft: any;
  export const Receipt: any;
  export const Percent: any;
  export const ArrowUp: any;
  export const ArrowDown: any;
  export const Bot: any;
  export const MessageSquare: any;
  export const CornerDownLeft: any;
  export const Mic: any;
  export const Lightbulb: any;
  export const Printer: any;
  export const FileSpreadsheet: any;
  export const BarChart3: any;
  export const GraduationCap: any;
  export const Award: any;
  export const Newspaper: any;
  export const Bookmark: any;
  export const BookmarkCheck: any;
  export const Share2: any;
  export const Trophy: any;
  export const Flame: any;
  export const Play: any;
  export const CheckCircle: any;
  export const XCircle: any;
  export const Users: any;
  export const UserX: any;
  export const Server: any;
  export const HardDrive: any;
  export const Database: any;
  export const Shield: any;
}

declare module 'three' {
  export class Group {
    constructor(...args: any[]);
    rotation: any;
    position: any;
    scale: any;
    visible: boolean;
    add(...args: any[]): any;
    remove(...args: any[]): any;
  }
  export class Mesh {
    constructor(...args: any[]);
    rotation: any;
    position: any;
    scale: any;
    visible: boolean;
    material: any;
  }
  export class Points {
    constructor(...args: any[]);
    rotation: any;
    position: any;
    scale: any;
    visible: boolean;
    material: any;
  }
  export class LineSegments {
    constructor(...args: any[]);
    rotation: any;
    position: any;
    scale: any;
    visible: boolean;
  }
  export class WebGLRenderer {
    constructor(...args: any[]);
    setSize(...args: any[]): void;
    setPixelRatio(...args: any[]): void;
    render(...args: any[]): void;
    dispose(): void;
    domElement: any;
    toneMapping: any;
    toneMappingExposure: any;
  }
  export class Scene {
    constructor(...args: any[]);
    add(...args: any[]): any;
    remove(...args: any[]): any;
    fog: any;
  }
  export class PerspectiveCamera {
    constructor(...args: any[]);
    position: any;
    lookAt(...args: any[]): void;
    updateProjectionMatrix(): void;
    aspect: number;
  }
  export class AmbientLight {
    constructor(...args: any[]);
    intensity: number;
  }
  export class PointLight {
    constructor(...args: any[]);
    position: any;
    intensity: number;
  }
  export class DirectionalLight {
    constructor(...args: any[]);
    position: any;
    intensity: number;
  }
  export class BufferGeometry {
    constructor(...args: any[]);
    setAttribute(...args: any[]): any;
    dispose(): void;
  }
  export class Float32BufferAttribute {
    constructor(...args: any[]);
  }
  export class PointsMaterial {
    constructor(...args: any[]);
    dispose(): void;
  }
  export class MeshStandardMaterial {
    constructor(...args: any[]);
    dispose(): void;
    opacity: number;
  }
  export class MeshPhysicalMaterial {
    constructor(...args: any[]);
    dispose(): void;
  }
  export class MeshBasicMaterial {
    constructor(...args: any[]);
    dispose(): void;
  }
  export class TorusKnotGeometry {
    constructor(...args: any[]);
    dispose(): void;
  }
  export class SphereGeometry {
    constructor(...args: any[]);
    dispose(): void;
  }
  export class IcosahedronGeometry {
    constructor(...args: any[]);
    dispose(): void;
  }
  export class OctahedronGeometry {
    constructor(...args: any[]);
    dispose(): void;
  }
  export class RingGeometry {
    constructor(...args: any[]);
    dispose(): void;
  }
  export class LineBasicMaterial {
    constructor(...args: any[]);
    dispose(): void;
  }
  export class WireframeGeometry {
    constructor(...args: any[]);
  }
  export class Color {
    constructor(...args: any[]);
    r: number;
    g: number;
    b: number;
  }
  export class FogExp2 {
    constructor(...args: any[]);
  }
  export class Clock {
    constructor(...args: any[]);
    getDelta(): number;
    getElapsedTime(): number;
  }
  export class Vector3 {
    constructor(...args: any[]);
  }
  export const AdditiveBlending: any;
  export const MathUtils: any;
  const three: any;
  export default three;
}

declare module '@react-three/fiber' {
  export const Canvas: any;
  export const useFrame: any;
}

declare module '@react-three/drei' {
  export const Float: any;
  export const MeshTransmissionMaterial: any;
}

declare module 'lenis' {
  export default class Lenis {
    constructor(options?: any);
    raf(time: number): void;
    destroy(): void;
    on(event: string, callback: (...args: any[]) => void): void;
  }
}

declare module 'gsap' {
  const gsap: any;
  export default gsap;
}

declare module 'gsap/ScrollTrigger' {
  export const ScrollTrigger: any;
}

declare module 'tailwindcss' {
  export type Config = any;
  const config: any;
  export default config;
}

declare module 'class-variance-authority' {
  export function cva(...args: any[]): any;
  export type VariantProps<T = any> = any;
}

declare module 'tailwind-merge' {
  export function twMerge(...classLists: any[]): string;
}

declare module 'clsx' {
  export type ClassValue = any;
  export function clsx(...inputs: any[]): string;
}

declare module 'ioredis' {
  export default class Redis {
    constructor(url?: string, options?: any);
    on(event: string, callback: (err: any) => void): void;
    incr(key: string): Promise<number>;
    expire(key: string, seconds: number): Promise<number>;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, mode?: string, duration?: number): Promise<'OK'>;
    del(key: string): Promise<number>;
    ping(): Promise<string>;
  }
}

declare module 'next-auth' {
  export interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      kycStatus: string;
      name?: string | null;
      image?: string | null;
    };
    expires: string;
  }
  export interface User {
    id?: string;
    email?: string | null;
    role?: string;
    kycStatus?: string;
    name?: string | null;
  }
  const NextAuth: any;
  export default NextAuth;
}

declare module 'next-auth/providers/google' {
  export default function Google(options: any): any;
}

declare module 'next-auth/providers/credentials' {
  export default function Credentials(options: any): any;
}

declare module '@auth/prisma-adapter' {
  export function PrismaAdapter(prisma: any): any;
}
