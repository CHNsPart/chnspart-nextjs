"use client";

import { SkillBar } from "../shared/SkillBar";
import { Timeline } from "../shared/Timeline";
import { EDUCATION, EXPERIENCE, TECH_STACK, SKILLS } from "@/lib/constants";

export default function Resume() {
  return (
    <article className="active" data-page="resume">
      <header>
        <h2 className="h2 article-title">
          Resume
        </h2>
      </header>

      <Timeline
        title="Education"
        icon="book"
        items={EDUCATION}
      />

      <Timeline 
        title="Experience"
        icon="briefcase"
        items={EXPERIENCE}
      />

      <Timeline 
        title="Tech Stack"
        icon="code-slash"
        items={TECH_STACK}
      />

      <section className="skill">
        <h3 className="text-[var(--white-2)] text-xl mb-5 skills-title font-bold">My Skills</h3>

        <ul className="skills-list content-card">
          {SKILLS.map((skill, index) => (
            <SkillBar
              key={index}
              name={skill.name}
              percentage={skill.percentage}
            />
          ))}
        </ul>
      </section>
    </article>
  );
}