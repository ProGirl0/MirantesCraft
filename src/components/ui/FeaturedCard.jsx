import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="relative h-full"
  >
    {/* Borda direita (topo para meio) */}
    <motion.div
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      viewport={{ once: true }}
      className="absolute top-0 right-0 w-px h-1/2 bg-gradient-to-b from-teal-400 to-transparent origin-top"
    />

    {/* Borda esquerda (base para meio) */}
    <motion.div
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      viewport={{ once: true }}
      className="absolute bottom-0 left-0 w-px h-1/2 bg-gradient-to-t from-teal-400 to-transparent origin-bottom"
    />

    <div className="bg-gray-800 p-8 h-full border-t border-b border-gray-700 hover:border-teal-400 transition-all duration-300">
      <div className="flex items-start">
        {/* Ícone em círculo teal-50 */}
        <div className="flex-shrink-0 mr-6">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-300/20">
            {icon}
          </div>
        </div>
        {/* Conteúdo textual */}
        <div>
          <h3 className="text-xl font-semibold mb-2 text-teal-500">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

export default FeatureCard;