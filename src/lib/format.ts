import { OutputFormat } from '../types';

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }

  return `${(milliseconds / 1000).toFixed(2)}s`;
}

export function extensionForFormat(format: OutputFormat): string {
  switch (format) {
    case 'Code':
      return 'ts';
    case 'Markdown':
      return 'md';
    case 'JSON':
      return 'json';
    case 'Plain text':
      return 'txt';
    default:
      return 'txt';
  }
}

export function sanitizeTag(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}
