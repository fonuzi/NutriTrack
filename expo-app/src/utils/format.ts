import { format, formatDistanceToNow } from 'date-fns';

// Format calories with commas and kcal suffix
export function formatCalories(calories: number): string {
  return `${calories.toLocaleString()} kcal`;
}

// Format macronutrients with g suffix
export function formatMacro(amount: number): string {
  return `${amount}g`;
}

// Calculate percentage of current value compared to target
export function calculatePercentage(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

// Format date and time for display
export function formatDateTime(date: Date | string, formatStr: string = "h:mm a"): string {
  return format(new Date(date), formatStr);
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Format time only (e.g., "2:30 PM")
export function formatTime(date: Date | string): string {
  return format(new Date(date), "h:mm a");
}

// Format date only (e.g., "Jan 15, 2025")
export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy");
}