'use client'


import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { addUserSkill } from '@/lib/services/user-service'
import { UserSkill } from '@/types'

export function SkillsOverview() {
  const skillSuggestions = [
    "React.js",
    "RESTful API design",
    "CSS",
    "Node.js",
    "TensorFlow",
    "FastAPI",
    "Final Cut Pro",
    "Photography"
  ];

  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const filteredSkills = skillSuggestions.filter(skill =>
    skill.toLowerCase().includes(search.toLowerCase())
  );

  const handleSkillClick = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      // Fetch all skills from DB to map names to IDs
      const { getAllSkills } = await import('@/lib/services/skill-service');
      const allSkills = await getAllSkills();
      for (const skillName of selectedSkills) {
        // Try to find skill by name
        let skillObj = allSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
        let skill_id = skillObj ? skillObj.id : null;
        // If not found, add new skill to DB
        if (!skill_id) {
          const { supabase } = await import('@/lib/supabase');
          const { data, error } = await supabase
            .from('skills')
            .insert({ name: skillName, is_approved: false, category: 'custom', created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
            .select()
            .single();
          if (error || !data) throw error || new Error('Skill creation failed');
          skill_id = data.id;
        }
        // Save user skill
        if (skill_id) {
          await addUserSkill({
            skill_id,
            type: 'wanted',
            proficiency_level: 1
          });
        }
      }
      setSaveMsg("Skills saved!");
    } catch (err) {
      setSaveMsg("Error saving skills. Please check your connection or try again.");
    }
    setSaving(false);
  };

  return (
    <Card className="card-gradient border border-[#8F6CD9]/20">
      <CardHeader>
        <CardTitle className="text-[#340773]">Skills I Want</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search or add a skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full p-3 border-2 border-[#8F6CD9]/30 rounded-lg focus:outline-none focus:border-[#8F6CD9] bg-white text-gray-900 transition-all duration-300"
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {filteredSkills.map((skill, idx) => (
            <Button
              key={idx}
              variant={selectedSkills.includes(skill) ? "default" : "outline"}
              onClick={() => handleSkillClick(skill)}
              className={`transition-all duration-200 px-3 py-1 rounded-full text-xs font-medium max-w-[140px] truncate whitespace-nowrap
                ${selectedSkills.includes(skill)
                  ? 'button-gradient text-white border-none shadow-md'
                  : 'bg-white text-[#340773] border border-[#8F6CD9]/40 hover:border-[#8F6CD9] hover:bg-[#8F6CD9]/5'}
              `}
            >
              {skill}
            </Button>
          ))}
        </div>
        {/* Add custom skill if not in suggestions */}
        {search && !skillSuggestions.some(s => s.toLowerCase() === search.toLowerCase()) && (
          <div className="mb-4">
            <Button
              variant={selectedSkills.includes(search) ? "default" : "outline"}
              onClick={() => handleSkillClick(search)}
              className={`transition-all duration-200 px-3 py-1 rounded-full text-xs font-medium max-w-[140px] truncate whitespace-nowrap
                ${selectedSkills.includes(search)
                  ? 'button-gradient text-white border-none shadow-md'
                  : 'bg-white text-[#340773] border border-[#8F6CD9]/40 hover:border-[#8F6CD9] hover:bg-[#8F6CD9]/5'}
              `}
            >
              Add "{search}"
            </Button>
          </div>
        )}
        <div className="flex justify-center">
          <Button
            onClick={handleSave}
            disabled={saving || selectedSkills.length === 0}
            className="mt-2 w-full py-3 font-semibold rounded-lg transition button-gradient text-white hover:shadow-lg disabled:opacity-50"
            style={{
              maxWidth: '220px',
            }}
          >
            {saving ? "Saving..." : "Save Skills"}
          </Button>
        </div>
        {saveMsg && <p className="mt-2 text-sm text-[#A68A56] text-center font-medium">{saveMsg}</p>}
      </CardContent>
    </Card>
  );
}
