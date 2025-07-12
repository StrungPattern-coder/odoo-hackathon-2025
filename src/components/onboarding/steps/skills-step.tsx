'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X, Star } from 'lucide-react'
import { useSkills } from '@/hooks/use-auth'

interface Skill {
  id: string
  name: string
  category: string
}

interface UserSkill {
  skill: Skill
  proficiency_level: number
  type: 'offered' | 'wanted'
}

interface SkillsStepProps {
  data: {
    offeredSkills: UserSkill[]
    wantedSkills: UserSkill[]
  }
  onChange: (data: any) => void
}

export function SkillsStep({ data, onChange }: SkillsStepProps) {
  const { skills: availableSkills, loading } = useSkills()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'Technology', 'Languages', 'Creative', 'Business', 'Other']

  const filteredSkills = availableSkills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addSkill = (skill: Skill, type: 'offered' | 'wanted', proficiencyLevel: number = 3) => {
    const userSkill: UserSkill = {
      skill,
      proficiency_level: proficiencyLevel,
      type
    }

    const key = type === 'offered' ? 'offeredSkills' : 'wantedSkills'
    const currentSkills = data[key] || []
    
    // Check if skill already exists
    const exists = currentSkills.some((s: UserSkill) => s.skill.id === skill.id)
    if (exists) return

    onChange({
      [key]: [...currentSkills, userSkill]
    })
  }

  const removeSkill = (skillId: string, type: 'offered' | 'wanted') => {
    const key = type === 'offered' ? 'offeredSkills' : 'wantedSkills'
    const currentSkills = data[key] || []
    
    onChange({
      [key]: currentSkills.filter((s: UserSkill) => s.skill.id !== skillId)
    })
  }

  const updateProficiency = (skillId: string, type: 'offered' | 'wanted', level: number) => {
    const key = type === 'offered' ? 'offeredSkills' : 'wantedSkills'
    const currentSkills = data[key] || []
    
    onChange({
      [key]: currentSkills.map((s: UserSkill) =>
        s.skill.id === skillId ? { ...s, proficiency_level: level } : s
      )
    })
  }

  const renderStars = (level: number, onStarClick?: (level: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < level 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        } ${onStarClick ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={() => onStarClick && onStarClick(i + 1)}
      />
    ))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Skills I Can Offer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skills I Can Offer</CardTitle>
          <p className="text-sm text-gray-600">
            Add skills you can teach or share with others
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.offeredSkills && data.offeredSkills.length > 0 ? (
            <div className="space-y-3">
              {data.offeredSkills.map((userSkill: UserSkill) => (
                <div key={userSkill.skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{userSkill.skill.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {userSkill.skill.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(userSkill.proficiency_level, (level) => 
                        updateProficiency(userSkill.skill.id, 'offered', level)
                      )}
                      <span className="text-xs text-gray-500 ml-2">
                        Level {userSkill.proficiency_level}/5
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(userSkill.skill.id, 'offered')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Plus className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No skills added yet. Browse skills below to add them.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills I Want to Learn */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skills I Want to Learn</CardTitle>
          <p className="text-sm text-gray-600">
            Add skills you'd like to learn from others
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.wantedSkills && data.wantedSkills.length > 0 ? (
            <div className="space-y-3">
              {data.wantedSkills.map((userSkill: UserSkill) => (
                <div key={userSkill.skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{userSkill.skill.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {userSkill.skill.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(userSkill.proficiency_level, (level) => 
                        updateProficiency(userSkill.skill.id, 'wanted', level)
                      )}
                      <span className="text-xs text-gray-500 ml-2">
                        Current Level {userSkill.proficiency_level}/5
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(userSkill.skill.id, 'wanted')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Plus className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No skills added yet. Browse skills below to add them.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Browse Available Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Browse Available Skills</CardTitle>
          <div className="space-y-4">
            <Input
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {filteredSkills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-sm text-gray-500">{skill.category}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill(skill, 'offered')}
                  >
                    Can Teach
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill(skill, 'wanted')}
                  >
                    Want to Learn
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {filteredSkills.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No skills found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
