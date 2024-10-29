interface SkillBarProps {
  name: string;
  percentage: number;
}

export const SkillBar = ({ name, percentage }: SkillBarProps) => (
  <li className="skills-item">
    <div className="title-wrapper">
      <h5 className="h5 font-bold">{name}</h5>
      <data value={percentage}>{percentage}%</data>
    </div>

    <div className="skill-progress-bg">
      <div 
        className="skill-progress-fill" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  </li>
);