import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  location?: string
  profilePhoto?: string
  skillsOffered: string[]
  skillsWanted: string[]
  availability: string[]
  isPublic: boolean
  rating: number
  totalSwaps: number
  isAdmin: boolean
  isBanned: boolean
}

export interface SwapRequest {
  id: string
  fromUserId: string
  toUserId: string
  fromUserName: string
  toUserName: string
  skillOffered: string
  skillWanted: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  message?: string
  createdAt: Date
  completedAt?: Date
  rating?: number
  feedback?: string
}

export interface AdminMessage {
  id: string
  title: string
  content: string
  createdAt: Date
}

interface SkillSwapState {
  currentUser: User | null
  users: User[]
  swapRequests: SwapRequest[]
  adminMessages: AdminMessage[]
  
  // User actions
  setCurrentUser: (user: User | null) => void
  updateUserProfile: (updates: Partial<User>) => void
  createUser: (user: Omit<User, 'id' | 'rating' | 'totalSwaps'>) => void
  
  // Swap actions
  createSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt'>) => void
  updateSwapRequest: (id: string, updates: Partial<SwapRequest>) => void
  deleteSwapRequest: (id: string) => void
  rateSwap: (id: string, rating: number, feedback?: string) => void
  
  // Admin actions
  banUser: (userId: string) => void
  unbanUser: (userId: string) => void
  deleteInappropriateSkill: (userId: string, skill: string, type: 'offered' | 'wanted') => void
  sendAdminMessage: (message: Omit<AdminMessage, 'id' | 'createdAt'>) => void
  
  // Getters
  getPublicUsers: () => User[]
  getUserSwapRequests: (userId: string) => SwapRequest[]
  getPendingSwapRequests: (userId: string) => SwapRequest[]
  getReceivedSwapRequests: (userId: string) => SwapRequest[]
  getSentSwapRequests: (userId: string) => SwapRequest[]
  searchUsersBySkill: (skill: string) => User[]
}

// Mock data
const mockUsers: User[] = [
  {
    id: 'user_2nFyaD8ZCYJGp1ZH7PqE3L8mQ1',
    name: 'John Doe',
    email: 'john@example.com',
    location: 'New York, NY',
    skillsOffered: ['JavaScript', 'React', 'Node.js'],
    skillsWanted: ['Python', 'Machine Learning', 'Docker'],
    availability: ['weekends', 'evenings'],
    isPublic: true,
    rating: 4.8,
    totalSwaps: 12,
    isAdmin: false,
    isBanned: false,
  },
  {
    id: 'user_admin123',
    name: 'Admin User',
    email: 'admin@skillswap.com',
    location: 'San Francisco, CA',
    skillsOffered: ['Project Management', 'Leadership', 'Strategic Planning'],
    skillsWanted: ['Data Science', 'UI/UX Design'],
    availability: ['weekdays'],
    isPublic: true,
    rating: 4.9,
    totalSwaps: 25,
    isAdmin: true,
    isBanned: false,
  },
  {
    id: 'user_alice456',
    name: 'Alice Smith',
    email: 'alice@example.com',
    location: 'London, UK',
    skillsOffered: ['Python', 'Data Science', 'SQL'],
    skillsWanted: ['React', 'Frontend Development'],
    availability: ['weekends'],
    isPublic: true,
    rating: 4.6,
    totalSwaps: 8,
    isAdmin: false,
    isBanned: false,
  },
  {
    id: 'user_bob789',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    location: 'Austin, TX',
    skillsOffered: ['UI/UX Design', 'Figma', 'Adobe Creative Suite'],
    skillsWanted: ['JavaScript', 'Backend Development'],
    availability: ['evenings', 'weekends'],
    isPublic: true,
    rating: 4.7,
    totalSwaps: 15,
    isAdmin: false,
    isBanned: false,
  },
  {
    id: 'user_carol101',
    name: 'Carol Davis',
    email: 'carol@example.com',
    location: 'Toronto, Canada',
    skillsOffered: ['Content Writing', 'SEO', 'Digital Marketing'],
    skillsWanted: ['Graphic Design', 'Video Editing'],
    availability: ['weekdays'],
    isPublic: true,
    rating: 4.5,
    totalSwaps: 6,
    isAdmin: false,
    isBanned: false,
  },
]

const mockSwapRequests: SwapRequest[] = [
  {
    id: 'swap_1',
    fromUserId: 'user_alice456',
    toUserId: 'user_2nFyaD8ZCYJGp1ZH7PqE3L8mQ1',
    fromUserName: 'Alice Smith',
    toUserName: 'John Doe',
    skillOffered: 'Python',
    skillWanted: 'React',
    status: 'pending',
    message: 'Hi! I would love to learn React from you in exchange for Python tutoring.',
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'swap_2',
    fromUserId: 'user_bob789',
    toUserId: 'user_2nFyaD8ZCYJGp1ZH7PqE3L8mQ1',
    fromUserName: 'Bob Johnson',
    toUserName: 'John Doe',
    skillOffered: 'UI/UX Design',
    skillWanted: 'JavaScript',
    status: 'accepted',
    message: 'I can help you with UI/UX design principles!',
    createdAt: new Date('2025-01-08'),
  },
]

export const useSkillSwapStore = create<SkillSwapState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: mockUsers,
      swapRequests: mockSwapRequests,
      adminMessages: [],

      setCurrentUser: (user) => set({ currentUser: user }),

      createUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: `user_${Date.now()}`,
          rating: 0,
          totalSwaps: 0,
        }
        set((state) => ({ 
          users: [...state.users, newUser],
          currentUser: newUser 
        }))
      },

      updateUserProfile: (updates) => {
        const { currentUser } = get()
        if (!currentUser) return

        set((state) => ({
          currentUser: { ...currentUser, ...updates },
          users: state.users.map((user) =>
            user.id === currentUser.id ? { ...user, ...updates } : user
          ),
        }))
      },

      createSwapRequest: (requestData) => {
        const newRequest: SwapRequest = {
          ...requestData,
          id: `swap_${Date.now()}`,
          createdAt: new Date(),
        }
        set((state) => ({
          swapRequests: [...state.swapRequests, newRequest],
        }))
      },

      updateSwapRequest: (id, updates) => {
        set((state) => ({
          swapRequests: state.swapRequests.map((request) =>
            request.id === id ? { ...request, ...updates } : request
          ),
        }))
      },

      deleteSwapRequest: (id) => {
        set((state) => ({
          swapRequests: state.swapRequests.filter((request) => request.id !== id),
        }))
      },

      rateSwap: (id, rating, feedback) => {
        set((state) => ({
          swapRequests: state.swapRequests.map((request) =>
            request.id === id 
              ? { ...request, rating, feedback, status: 'completed' as const, completedAt: new Date() }
              : request
          ),
        }))
      },

      banUser: (userId) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, isBanned: true } : user
          ),
        }))
      },

      unbanUser: (userId) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, isBanned: false } : user
          ),
        }))
      },

      deleteInappropriateSkill: (userId, skill, type) => {
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id !== userId) return user
            const updatedUser = { ...user }
            if (type === 'offered') {
              updatedUser.skillsOffered = user.skillsOffered.filter(s => s !== skill)
            } else {
              updatedUser.skillsWanted = user.skillsWanted.filter(s => s !== skill)
            }
            return updatedUser
          }),
        }))
      },

      sendAdminMessage: (messageData) => {
        const newMessage: AdminMessage = {
          ...messageData,
          id: `msg_${Date.now()}`,
          createdAt: new Date(),
        }
        set((state) => ({
          adminMessages: [newMessage, ...state.adminMessages],
        }))
      },

      getPublicUsers: () => {
        return get().users.filter((user) => user.isPublic && !user.isBanned)
      },

      getUserSwapRequests: (userId) => {
        return get().swapRequests.filter(
          (request) => request.fromUserId === userId || request.toUserId === userId
        )
      },

      getPendingSwapRequests: (userId) => {
        return get().swapRequests.filter(
          (request) => 
            (request.fromUserId === userId || request.toUserId === userId) && 
            request.status === 'pending'
        )
      },

      getReceivedSwapRequests: (userId) => {
        return get().swapRequests.filter(
          (request) => request.toUserId === userId && request.status === 'pending'
        )
      },

      getSentSwapRequests: (userId) => {
        return get().swapRequests.filter(
          (request) => request.fromUserId === userId
        )
      },

      searchUsersBySkill: (skill) => {
        const { users } = get()
        const searchTerm = skill.toLowerCase()
        return users.filter(
          (user) =>
            user.isPublic &&
            !user.isBanned &&
            user.skillsOffered.some((s) => s.toLowerCase().includes(searchTerm))
        )
      },
    }),
    {
      name: 'skill-swap-storage',
    }
  )
)
