import { Badge } from '@/components/ui/badge';

interface NotImplementedBadgeProps {
  label?: string;
}

export function NotImplementedBadge({ label = 'Not implemented yet' }: NotImplementedBadgeProps) {
  return (
    <Badge variant="outline" className="border-border bg-background/80 text-[0.65rem] text-muted-foreground">
      {label}
    </Badge>
  );
}
