import { cn } from '@/utils/cn';

interface LogoProps {
  className?: string;
}

export function LogoSquare({ className }: LogoProps) {
  return (
    <img
      src="/logo.svg"
      className={cn('rounded-md', className)}
      alt="AGS Analytics logo"
    />
  );
}

export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn('flex items-center gap-2 text-xl font-medium', className)}
    >
      <LogoSquare className="max-h-8" />
      <span>AGS Analytics</span>
    </div>
  );
}
