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
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
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
    'Technology': 'bg-blue-100 text-blue-800 border-blue-200',
    'Design': 'bg-purple-100 text-purple-800 border-purple-200',
    'Business': 'bg-green-100 text-green-800 border-green-200',
    'Language': 'bg-orange-100 text-orange-800 border-orange-200',
    'Art': 'bg-pink-100 text-pink-800 border-pink-200',
    'Music': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Fitness': 'bg-red-100 text-red-800 border-red-200',
    'Cooking': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Other': 'bg-gray-100 text-gray-800 border-gray-200',
  }
  
  return colors[category] || colors['Other']
}

export function getSwapStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'accepted': 'bg-green-100 text-green-800 border-green-200',
    'rejected': 'bg-red-100 text-red-800 border-red-200',
    'cancelled': 'bg-gray-100 text-gray-800 border-gray-200',
    'completed': 'bg-blue-100 text-blue-800 border-blue-200',
  }
  
  return colors[status] || colors['pending']
}

export function getDefaultAvatar(name: string): string {
  return generateAvatar(name)
}
