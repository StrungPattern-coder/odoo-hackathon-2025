import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import BrowsePage from '@/components/dashboard/browse-page'

export default async function Browse() {
  return <BrowsePage />
} 