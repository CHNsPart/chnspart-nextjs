import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedText = ({ text, className = '' }: AnimatedTextProps) => (
  <motion.span
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {text}
  </motion.span>
);