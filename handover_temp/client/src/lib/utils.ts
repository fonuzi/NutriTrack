import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
}

export function applyPrimaryColor(color: string): void {
  const rootElement = document.documentElement;
  rootElement.style.setProperty('--primary', color);
  rootElement.style.setProperty('--primary-foreground', getContrastingColor(color));
}

function getContrastingColor(hexColor: string): string {
  // Remove the # if it exists
  hexColor = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white depending on the luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

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