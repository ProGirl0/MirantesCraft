import { motion } from 'framer-motion';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CodeBracketIcon,
  HeartIcon 
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gray-900/90 backdrop-blur-sm border-t border-gray-800 relative overflow-hidden"
    >
      {/* Efeito decorativo */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-teal-400/10 filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center mb-4"
            >

              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-600">
                Mirantes Craft
              </span>
            </motion.div>
            <p className="text-gray-400 mb-4">
              Transformando ideias em realidade com ferramentas poderosas e intuitivas.
            </p>

          </div>


         
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} Mirantes Craft. Todos os direitos reservados.
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center text-gray-500 hover:text-teal-400 transition-colors"
          >
            <HeartIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">By Mirantes Technologies</span>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;