import { motion } from 'framer-motion';

const AnimatedCard = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="relative"
  >
    <motion.div
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
      className="absolute inset-0 pointer-events-none"
    >
      <svg width="100%" height="100%" className="overflow-visible">
        <motion.rect
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          x="1"
          y="1"
          rx="0" // Removido border-radius
          stroke="url(#pencilGradient)"
          strokeWidth="2"
          strokeDasharray="0 1"
          fill="transparent"
          pathLength="1"
        />
        <defs>
          <linearGradient id="pencilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
    {children}
  </motion.div>
);

export default AnimatedCard;