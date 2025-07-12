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
    <div className="flex justify-center items-center min-h-[40vh]">
      <Card className="w-full max-w-xl shadow-lg border border-[var(--primary)] bg-[var(--background)]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold text-[var(--primary)]">Skills I Want</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search or add a skill..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full p-3 border-2 border-[var(--accent)] rounded-lg focus:outline-none focus:border-[var(--primary)] bg-[var(--card)] text-[var(--secondary)]"
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
                    ? 'bg-[var(--accent)] text-white border-none'
                    : 'bg-[var(--card)] text-[var(--highlight)] border border-[var(--accent)]'}
                `}
                style={{
                  color: selectedSkills.includes(skill) ? '#fff' : '#A68A56',
                  background: selectedSkills.includes(skill) ? '#8F6CD9' : 'var(--card)',
                  borderColor: '#8F6CD9',
                  fontSize: '0.85rem',
                }}
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
                    ? 'bg-[var(--accent)] text-white border-none'
                    : 'bg-[var(--card)] text-[var(--highlight)] border border-[var(--accent)]'}
                `}
                style={{
                  color: selectedSkills.includes(search) ? '#fff' : '#A68A56',
                  background: selectedSkills.includes(search) ? '#8F6CD9' : 'var(--card)',
                  borderColor: '#8F6CD9',
                  fontSize: '0.85rem',
                }}
              >
                Add "{search}"
              </Button>
            </div>
          )}
          <div className="flex justify-center">
            <Button
              onClick={handleSave}
              disabled={saving || selectedSkills.length === 0}
              className="mt-2 w-full py-3 font-semibold rounded-lg transition"
              style={{
                maxWidth: '220px',
                background: saving ? '#A68A56' : '#8F6CD9',
                color: '#fff',
                border: '2px solid #340773',
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(52,7,115,0.08)'
              }}
            >
              {saving ? "Saving..." : "Save Skills"}
            </Button>
          </div>
          {saveMsg && <p className="mt-2 text-sm text-green-600 text-center">{saveMsg}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
