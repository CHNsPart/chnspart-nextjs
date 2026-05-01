"use client";

import { motion } from "framer-motion";
import { SkillBar } from "../shared/SkillBar";
import { Timeline } from "../shared/Timeline";
import { Download } from "lucide-react";
import { EDUCATION, VENTURES, FREELANCE, PROFESSIONAL_EXPERIENCE, TECH_STACK, SKILLS } from "@/lib/constants";

export default function Resume() {
  const handleDownload = () => {
    // Replace this URL with your actual resume PDF URL
    const resumeUrl = "/resume/TIC_Resume_2026.pdf";
    window.open(resumeUrl, '_blank');
  };

  return (
    <motion.article 
      className="active" 
      data-page="resume"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="h2 article-title">Resume</h2>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Timeline
          title="Education"
          icon="book"
          items={EDUCATION}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--onyx)] flex justify-between items-center mb-8 py-2 px-4 rounded-xl"
      >
        <div className="">
          <h2 className="h4">Paper Resume</h2>
          <h2 className="h5 timeline-text">Download in a pdf format</h2>
        </div>
        <motion.button
          onClick={handleDownload}
          className="gradient-border flex items-center gap-2 px-5 py-4 rounded-xl 
          hover:text-[var(--eerie-black-1)] text-[var(--orange-yellow-crayola)] text-sm font-medium
          hover:bg-gradient-to-br hover:from-[hsl(45,100%,71%)] hover:to-[hsla(36,100%,69%,0)]
          transition-all ease-linear"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Download size={18} />
          <span>Download</span>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Timeline 
          title="Ventures"
          icon="briefcase"
          items={VENTURES}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Timeline 
          title="Freelance"
          icon="briefcase"
          items={FREELANCE}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--onyx)] flex justify-between items-center mb-8 py-2 px-4 rounded-xl"
      >
        <div className="">
          <h2 className="h4">My Reviews</h2>
          <h2 className="h5 timeline-text">Checkout my Google review</h2>
        </div>
        <motion.img
          src="/resume/gr.png"
          alt="Google Review Badge"
          width={150}
          height={50}
          className="gradient-border flex items-center gap-2 px-8 md:px-5 py-4 rounded-xl 
          hover:text-[var(--eerie-black-1)] text-[var(--orange-yellow-crayola)] text-sm font-medium
          hover:bg-gradient-to-br hover:from-[var(--eerie-black-1)] hover:to-[var(--onyx)]
          transition-all ease-linear"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => window.open('https://maps.app.goo.gl/5GKvBh4xyhWMwTnS9?g_st=afm', '_blank')}
          style={{ cursor: 'pointer' }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Timeline 
          title="Professional Experience"
          icon="briefcase"
          items={PROFESSIONAL_EXPERIENCE}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <Timeline 
          title="Tech Stack"
          icon="code-slash"
          items={TECH_STACK}
        />
      </motion.div>

      <motion.section 
        className="skill"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-[var(--white-2)] text-xl mb-5 skills-title font-bold">My Skills</h3>

        <ul className="skills-list content-card">
          {SKILLS.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <SkillBar
                name={skill.name}
                percentage={skill.percentage}
              />
            </motion.div>
          ))}
        </ul>
      </motion.section>
    </motion.article>
  );
}