import React from "react";

export default function SkillsSection({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Technical Arsenal</h2>
          <p className="text-slate-400">Languages, frameworks, and tools I use to build.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Categorized Visuals using Bento style cards */}

          {/* Languages */}
          {data.filter(s => ["Java", "Python", "JavaScript", "Kotlin"].includes(s.name)).length > 0 && (
            <div className="p-6 rounded-2xl bg-background-card-dark bento-border group relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">code_blocks</span>
                </div>
                <h3 className="font-bold text-white text-lg">Core Languages</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.filter(s => ["Java", "Python", "JavaScript", "Kotlin"].includes(s.name)).map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-slate-300 group-hover:border-primary/30 transition-colors">
                    {skill.name}
                  </span>
                ))}
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors"></div>
            </div>
          )}

          {/* Frameworks & Mobile */}
          {data.filter(s => ["React Native", "Jetpack Compose", "Android (Java)", "Node.js", "React"].includes(s.name)).length > 0 && (
            <div className="p-6 rounded-2xl bg-background-card-dark bento-border group relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-lg bg-accent-teal/10 flex items-center justify-center text-accent-teal">
                  <span className="material-symbols-outlined">smartphone</span>
                </div>
                <h3 className="font-bold text-white text-lg">Mobile & Web</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.filter(s => ["React Native", "Jetpack Compose", "Android (Java)", "Node.js", "React"].includes(s.name)).map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-slate-300 group-hover:border-accent-teal/30 transition-colors">
                    {skill.name}
                  </span>
                ))}
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-teal/5 blur-3xl -z-10 group-hover:bg-accent-teal/10 transition-colors"></div>
            </div>
          )}

          {/* Tools & DevOps */}
          {data.filter(s => ["Git", "Firebase Firestore", "MySQL", "Postman", "Jira", "Agile"].includes(s.name)).length > 0 && (
            <div className="p-6 rounded-2xl bg-background-card-dark bento-border group relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">build</span>
                </div>
                <h3 className="font-bold text-white text-lg">Tools & DevOps</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.filter(s => ["Git", "Firebase Firestore", "MySQL", "Postman", "Jira", "Agile"].includes(s.name)).map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-slate-300 group-hover:border-white/30 transition-colors">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* All Skills List (Full View) */}
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Complete Tech Stack</h3>
          <div className="flex flex-wrap gap-3">
            {data.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-background-dark border border-white/5 rounded-lg text-xs font-mono text-slate-400 hover:text-primary hover:border-primary/30 transition-colors">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
