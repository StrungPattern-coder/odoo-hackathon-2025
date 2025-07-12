'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getUserSkills } from '@/lib/services/user-service'
import { UserSkill } from '@/types'
import { BookOpen, Plus, Star } from 'lucide-react'
import Link from 'next/link'

export function SkillsOverview() {
  const [offeredSkills, setOfferedSkills] = useState<UserSkill[]>([])
  const [wantedSkills, setWantedSkills] = useState<UserSkill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSkills() {
      try {
        const skills = await getUserSkills()
        setOfferedSkills(skills.filter(s => s.type === 'offered'))
        setWantedSkills(skills.filter(s => s.type === 'wanted'))
      } catch (error) {
        console.error('Error loading skills:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSkills()
  }, [])

  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < level ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Offered Skills */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Skills I Offer</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/skills">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {offeredSkills.length === 0 ? (
            <div className="text-center py-4">
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No skills offered yet</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link href="/dashboard/skills">Add Skills</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {offeredSkills.slice(0, 3).map((skill) => (
                <div key={skill.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{skill.skill?.name}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(skill.proficiency_level)}
                    </div>
                  </div>
                </div>
              ))}
              {offeredSkills.length > 3 && (
                <p className="text-xs text-gray-500 text-center pt-2">
                  +{offeredSkills.length - 3} more skills
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wanted Skills */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Skills I Want</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/skills">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {wantedSkills.length === 0 ? (
            <div className="text-center py-4">
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No skills wanted yet</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link href="/dashboard/skills">Add Skills</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {wantedSkills.slice(0, 3).map((skill) => (
                <div key={skill.id}>
                  <p className="font-medium text-sm">{skill.skill?.name}</p>
                  {skill.description && (
                    <p className="text-xs text-gray-600 mt-1">{skill.description}</p>
                  )}
                </div>
              ))}
              {wantedSkills.length > 3 && (
                <p className="text-xs text-gray-500 text-center pt-2">
                  +{wantedSkills.length - 3} more skills
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
