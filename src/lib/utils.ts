import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears}y ago`
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function calculateLevel(xp: number): number {
  // Level calculation: Level = floor(sqrt(XP / 100))
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function getXpForNextLevel(currentLevel: number): number {
  // XP required for next level: (level^2) * 100
  return (currentLevel * currentLevel) * 100
}

export function getXpProgress(xp: number, level: number): number {
  const currentLevelXp = ((level - 1) * (level - 1)) * 100
  const nextLevelXp = getXpForNextLevel(level)
  const progressXp = xp - currentLevelXp
  const requiredXp = nextLevelXp - currentLevelXp
  
  return Math.min((progressXp / requiredXp) * 100, 100)
}

export function generateAvatar(name: string): string {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  const colors = [
    '#340773', '#8F6CD9', '#A68A56', '#150140', '#0D0126',
    '#5B4B8A', '#B794E6', '#D4B879', '#2A0952', '#1A033A'
  ]
  
  const colorIndex = name.length % colors.length
  const bgColor = colors[colorIndex]
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" fill="${bgColor}"/>
      <text x="60" y="60" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
    </svg>
  `)}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getSkillCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Technology': 'bg-brand-accent/10 text-brand-accent border-brand-accent/30',
    'Design': 'bg-brand-primary/10 text-brand-primary border-brand-primary/30',
    'Business': 'bg-brand-gold/10 text-brand-gold border-brand-gold/30',
    'Language': 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/30',
    'Art': 'bg-brand-accent/10 text-brand-accent border-brand-accent/30',
    'Music': 'bg-brand-primary/10 text-brand-primary border-brand-primary/30',
    'Fitness': 'bg-red-100 text-red-800 border-red-200',
    'Cooking': 'bg-orange-100 text-orange-800 border-orange-200',
    'Other': 'bg-gray-100 text-gray-800 border-gray-200',
  }
  
  return colors[category] || colors['Other']
}

export function getSwapStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'pending': 'bg-brand-gold/10 text-brand-gold border-brand-gold/30',
    'accepted': 'bg-brand-accent/10 text-brand-accent border-brand-accent/30',
    'rejected': 'bg-red-100 text-red-800 border-red-200',
    'cancelled': 'bg-gray-100 text-gray-800 border-gray-200',
    'completed': 'bg-brand-primary/10 text-brand-primary border-brand-primary/30',
  }
  
  return colors[status] || colors['pending']
}
