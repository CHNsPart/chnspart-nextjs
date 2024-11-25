import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTransition } from '../shared/PageTransition';
import { PORTFOLIO_ITEMS } from '@/lib/constants';
import { ProjectCard } from '../shared/ProjectCard';

const categories = ["All", "Web design", "Applications", "Web development", "Open source"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filteredProjects = PORTFOLIO_ITEMS.filter(project => 
    activeCategory === "All" || project.category.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <PageTransition>
      <article className="portfolio active relative z-0 pb-20" data-page="portfolio">
        <header>
          <h2 className="h2 article-title">Portfolio</h2>
        </header>

        <motion.div 
          className="flex flex-wrap gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-base transition-colors duration-300
                ${activeCategory === category 
                  ? 'text-[var(--orange-yellow-crayola)]' 
                  : 'text-[var(--light-gray)] hover:text-[var(--light-gray-70)]'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.title}
                index={index}
                {...project}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </article>
    </PageTransition>
  );
}