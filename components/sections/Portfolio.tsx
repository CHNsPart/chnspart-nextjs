"use client"

import { useState } from 'react';
import { ProjectCard } from '../shared/ProjectCard';
import { PORTFOLIO_ITEMS } from '@/lib/constants';

const categories = ["All", "Web design", "Applications", "Web development", "Open source"];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");

  const projects = PORTFOLIO_ITEMS

  const filteredProjects = projects.filter(project => 
    activeCategory === "All" || project.category.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <article className="active relative z-0 pb-20" data-page="portfolio">
      <header>
        <h2 className="h2 article-title">
          Portfolio
        </h2>
      </header>

      <div className="hidden md:flex gap-6 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`text-base transition-colors duration-300
              ${activeCategory === category 
                ? 'text-[var(--orange-yellow-crayola)]' 
                : 'text-[var(--light-gray)] hover:text-[var(--light-gray-70)]'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.title}
            {...project}
          />
        ))}
      </div>
    </article>
  );
}