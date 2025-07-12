"use client"
import { useState, useEffect } from 'react'
import { useCurrentUser, useUserSkills } from '@/hooks/use-auth'
import { updateUserProfile } from '@/lib/services/user-service'
import { getAllSkills } from '@/lib/services/skill-service'
import { addUserSkill, removeUserSkill } from '@/lib/services/user-service'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { useToast } from '@/hooks/use-toast'
import { getDefaultAvatar } from '@/lib/utils'
import { 
  UploadIcon, 
  Loader2, 
  Pencil, 
  Check, 
  X, 
  User, 
  MapPin, 
  Clock, 
  Eye, 
  EyeOff,
  Plus,
  Trash2,
  Save,
  Edit3
} from 'lucide-react'

export default function ProfilePage() {
  const { supabaseUser, loading: userLoading } = useCurrentUser()
  const { skills: offeredSkills, loading: offeredLoading, refetch: refetchOffered } = useUserSkills(supabaseUser?.id, 'offered')
  const { skills: wantedSkills, loading: wantedLoading, refetch: refetchWanted } = useUserSkills(supabaseUser?.id, 'wanted')
  const { toast } = useToast()
  
  // Form state
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    location: '',
    bio: '',
    is_public: true,
    availability_status: 'available' as 'available' | 'busy' | 'offline',
    image_url: '',
  })
  
  // Edit states
  const [editingField, setEditingField] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')
  
  // Skills state
  const [allSkills, setAllSkills] = useState<any[]>([])
  const [skillSearch, setSkillSearch] = useState('')
  const [addingSkillType, setAddingSkillType] = useState<'offered' | 'wanted' | null>(null)
  const [selectedSkillId, setSelectedSkillId] = useState('')
  const [selectedProficiency, setSelectedProficiency] = useState(3)
  const [removingSkillId, setRemovingSkillId] = useState<string | null>(null)

  // Initialize form when user data loads
  useEffect(() => {
    if (supabaseUser) {
      setForm({
        first_name: supabaseUser.first_name || '',
        last_name: supabaseUser.last_name || '',
        location: supabaseUser.location || '',
        bio: supabaseUser.bio || '',
        is_public: supabaseUser.is_public ?? true,
        availability_status: (supabaseUser.availability_status as 'available' | 'busy' | 'offline') || 'available',
        image_url: supabaseUser.image_url || '',
      })
      setPhotoPreview(supabaseUser.image_url || '')
    }
  }, [supabaseUser])

  // Load all skills for selection
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const skills = await getAllSkills()
        setAllSkills(skills)
      } catch (error) {
        console.error('Error loading skills:', error)
        toast({
          title: "Error",
          description: "Failed to load skills",
          variant: "destructive",
        })
      }
    }
    loadSkills()
  }, [toast])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    let newValue: string | boolean = value
    if (type === 'checkbox' && 'checked' in e.target) {
      newValue = (e.target as HTMLInputElement).checked
    }
    setForm((prev) => ({ ...prev, [name]: newValue }))
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Create preview
    setPhotoPreview(URL.createObjectURL(file))
    
    // TODO: Upload to Supabase storage and update form.image_url
    toast({
      title: "Photo Upload",
      description: "Photo upload functionality will be implemented soon",
    })
  }

  async function handleSaveField() {
    if (!editingField) return
    
    setSaving(true)
    try {
      await updateUserProfile(form)
      setEditingField(null)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error('Error saving field:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleAddSkill(type: 'offered' | 'wanted') {
    setAddingSkillType(type)
    setSkillSearch('')
    setSelectedSkillId('')
    setSelectedProficiency(3)
  }

  async function handleSaveSkill() {
    if (!selectedSkillId || !addingSkillType) return
    
    setSaving(true)
    try {
      await addUserSkill({
        skill_id: selectedSkillId,
        type: addingSkillType,
        proficiency_level: selectedProficiency as 1 | 2 | 3 | 4 | 5,
      })
      
      setAddingSkillType(null)
      setSelectedSkillId('')
      setSelectedProficiency(3)
      
      if (addingSkillType === 'offered') refetchOffered()
      if (addingSkillType === 'wanted') refetchWanted()
      
      toast({
        title: "Success",
        description: "Skill added successfully",
      })
    } catch (error) {
      console.error('Error adding skill:', error)
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleRemoveSkill(skillId: string) {
    setRemovingSkillId(skillId)
    try {
      await removeUserSkill(skillId)
      refetchOffered()
      refetchWanted()
      toast({
        title: "Success",
        description: "Skill removed successfully",
      })
    } catch (error) {
      console.error('Error removing skill:', error)
      toast({
        title: "Error",
        description: "Failed to remove skill",
        variant: "destructive",
      })
    } finally {
      setRemovingSkillId(null)
    }
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin h-8 w-8 mr-2" /> 
          Loading profile...
        </div>
      </div>
    )
  }

  const filteredSkills = allSkills.filter(skill => 
    skill.name.toLowerCase().includes(skillSearch.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your profile information and skills</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Photo Card */}
          <div className="xl:col-span-1">
            <Card className="p-4 sm:p-6 flex flex-col items-center justify-center">
              <CardHeader className="text-center">
                <CardTitle>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="relative mb-4">
                  {photoPreview && !photoPreview.includes('unsplash.com') ? (
                    <img
                      src={photoPreview}
                      alt="Profile Photo"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                      onError={(e) => {
                        // Fallback to user icon if image fails to load
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          const iconDiv = parent.querySelector('.user-icon-fallback')
                          if (iconDiv) {
                            iconDiv.classList.remove('hidden')
                          }
                        }
                      }}
                    />
                  ) : null}
                  
                  {/* User Icon Fallback */}
                  <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-purple-200 shadow-lg bg-gray-100 flex items-center justify-center ${photoPreview && !photoPreview.includes('unsplash.com') ? 'hidden' : ''} user-icon-fallback`}>
                    <User className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                  </div>
                  
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer border border-purple-300 hover:bg-purple-50 transition-colors">
                    <UploadIcon className="h-4 w-4 text-purple-600" />
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Click the icon to upload a new photo
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information Card */}
          <div className="xl:col-span-2">
            <Card className="p-4 sm:p-6">
              <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Edit3 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-0">
                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">First Name</Label>
                    <div className="mt-1 flex items-center gap-2">
                      {editingField === 'first_name' ? (
                        <>
                          <Input
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            className="flex-1 text-sm sm:text-base"
                            placeholder="Enter first name"
                          />
                          <Button size="sm" onClick={handleSaveField} disabled={saving} className="flex-shrink-0">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingField(null)} className="flex-shrink-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-gray-900 text-sm sm:text-base truncate">{form.first_name || 'Not set'}</span>
                          <Button size="sm" variant="ghost" onClick={() => setEditingField('first_name')} className="flex-shrink-0">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                    <div className="mt-1 flex items-center gap-2">
                      {editingField === 'last_name' ? (
                        <>
                          <Input
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            className="flex-1"
                            placeholder="Enter last name"
                          />
                          <Button size="sm" onClick={handleSaveField} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-gray-900">{form.last_name || 'Not set'}</span>
                          <Button size="sm" variant="ghost" onClick={() => setEditingField('last_name')}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    {editingField === 'location' ? (
                      <>
                        <Input
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          className="flex-1"
                          placeholder="Enter your location"
                        />
                        <Button size="sm" onClick={handleSaveField} disabled={saving}>
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-gray-900">{form.location || 'Not set'}</span>
                        <Button size="sm" variant="ghost" onClick={() => setEditingField('location')}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Bio</Label>
                  <div className="mt-1">
                    {editingField === 'bio' ? (
                      <div className="space-y-2">
                        <Textarea
                          name="bio"
                          value={form.bio}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Tell others about yourself..."
                          className="flex-1"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveField} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
                            <X className="h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <p className="flex-1 text-gray-900 min-h-[3rem]">
                          {form.bio || 'No bio yet. Click edit to add one.'}
                        </p>
                        <Button size="sm" variant="ghost" onClick={() => setEditingField('bio')}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Availability and Privacy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Availability Status
                    </Label>
                    <div className="mt-1 flex items-center gap-2">
                      {editingField === 'availability_status' ? (
                        <>
                          <select
                            name="availability_status"
                            value={form.availability_status}
                            onChange={handleChange}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                          >
                            <option value="available">Available</option>
                            <option value="busy">Busy</option>
                            <option value="offline">Offline</option>
                          </select>
                          <Button size="sm" onClick={handleSaveField} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Badge variant="secondary" className="flex-1 justify-center">
                            {form.availability_status}
                          </Badge>
                          <Button size="sm" variant="ghost" onClick={() => setEditingField('availability_status')}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      {form.is_public ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      Profile Visibility
                    </Label>
                    <div className="mt-1 flex items-center gap-2">
                      {editingField === 'is_public' ? (
                        <>
                          <div className="flex-1 flex items-center gap-2">
                            <Switch
                              checked={form.is_public}
                              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_public: checked }))}
                            />
                            <span className="text-sm text-gray-600">
                              {form.is_public ? 'Public' : 'Private'}
                            </span>
                          </div>
                          <Button size="sm" onClick={handleSaveField} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Badge variant={form.is_public ? 'default' : 'outline'} className="flex-1 justify-center">
                            {form.is_public ? 'Public' : 'Private'}
                          </Badge>
                          <Button size="sm" variant="ghost" onClick={() => setEditingField('is_public')}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills Offered */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  Skills Offered
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddSkill('offered')}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Skill
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {addingSkillType === 'offered' && (
                <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 space-y-3">
                  <Input
                    placeholder="Search skills..."
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    className="border-green-300"
                  />
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                          selectedSkillId === skill.id
                            ? 'bg-green-200 text-green-800'
                            : 'hover:bg-green-100'
                        }`}
                        onClick={() => setSelectedSkillId(skill.id)}
                      >
                        {skill.name}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Proficiency:</Label>
                    <select
                      value={selectedProficiency}
                      onChange={(e) => setSelectedProficiency(Number(e.target.value))}
                      className="border border-green-300 rounded px-2 py-1 text-sm"
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <option key={level} value={level}>
                          Level {level}
                        </option>
                      ))}
                    </select>
                    <Button size="sm" onClick={handleSaveSkill} disabled={saving || !selectedSkillId}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAddingSkillType(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {offeredLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin h-6 w-6" />
                </div>
              ) : offeredSkills.length > 0 ? (
                <div className="space-y-2">
                  {offeredSkills.map((userSkill) => (
                    <div
                      key={userSkill.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-600">
                          {userSkill.skill?.name}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Level {userSkill.proficiency_level}/5
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveSkill(userSkill.id)}
                        disabled={removingSkillId === userSkill.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {removingSkillId === userSkill.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Plus className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No skills offered yet</p>
                  <p className="text-sm">Add skills you can teach others</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Wanted */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-purple-600" />
                  Skills Wanted
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddSkill('wanted')}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Skill
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {addingSkillType === 'wanted' && (
                <div className="mb-4 p-4 rounded-lg bg-purple-50 border border-purple-200 space-y-3">
                  <Input
                    placeholder="Search skills..."
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    className="border-purple-300"
                  />
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                          selectedSkillId === skill.id
                            ? 'bg-purple-200 text-purple-800'
                            : 'hover:bg-purple-100'
                        }`}
                        onClick={() => setSelectedSkillId(skill.id)}
                      >
                        {skill.name}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Proficiency:</Label>
                    <select
                      value={selectedProficiency}
                      onChange={(e) => setSelectedProficiency(Number(e.target.value))}
                      className="border border-purple-300 rounded px-2 py-1 text-sm"
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <option key={level} value={level}>
                          Level {level}
                        </option>
                      ))}
                    </select>
                    <Button size="sm" onClick={handleSaveSkill} disabled={saving || !selectedSkillId}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAddingSkillType(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {wantedLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin h-6 w-6" />
                </div>
              ) : wantedSkills.length > 0 ? (
                <div className="space-y-2">
                  {wantedSkills.map((userSkill) => (
                    <div
                      key={userSkill.id}
                      className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-purple-300 text-purple-700">
                          {userSkill.skill?.name}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Level {userSkill.proficiency_level}/5
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveSkill(userSkill.id)}
                        disabled={removingSkillId === userSkill.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {removingSkillId === userSkill.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Plus className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No skills wanted yet</p>
                  <p className="text-sm">Add skills you want to learn</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
