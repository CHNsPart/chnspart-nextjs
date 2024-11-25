import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SkillBarProps {
  name: string;
  percentage: number;
}

export const SkillBar = ({ name, percentage }: SkillBarProps) => {
  const skillRef = useRef(null);
  const isInView = useInView(skillRef, { once: true, margin: "-50px" });

  return (
    <li className="skills-item py-2" ref={skillRef}>
      <div className="title-wrapper flex justify-between">
        <h5 className="h5 font-bold">{name}</h5>
        <motion.data 
          value={percentage}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {percentage}%
        </motion.data>
      </div>

      <div className="skill-progress-bg">
        <motion.div 
          className="skill-progress-fill"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        />
      </div>
    </li>
  );
};