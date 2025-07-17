import { motion } from 'framer-motion';

const DrawingPencil = () => (
  <motion.div
    initial={{ rotate: -15 }}
    animate={{ 
      rotate: [ -15, 15, -15 ],
      x: [0, 5, 0],
      y: [0, -5, 0]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute z-0"
  >
    <svg
      width="60"
      height="60"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-teal-400"
    >
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  </motion.div>
);

export default DrawingPencil;