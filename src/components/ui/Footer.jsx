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
              <CodeBracketIcon className="h-8 w-8 text-teal-400 mr-2" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-600">
                IdeaFlow
              </span>
            </motion.div>
            <p className="text-gray-400 mb-4">
              Transformando ideias em realidade com ferramentas poderosas e intuitivas.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'github', 'linkedin'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="h-6 w-6">
                    {/* Ícones sociais podem ser substituídos por biblioteca específica */}
                    <div className={`bg-gray-400 hover:bg-teal-400 mask mask-${social} w-full h-full`}></div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
            <ul className="space-y-2">
              {['Recursos', 'Preços', 'Blog', 'Documentação'].map((item) => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <EnvelopeIcon className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                <a href="mailto:contato@ideaflow.com" className="text-gray-400 hover:text-teal-400 transition-colors">
                  contato@ideaflow.com
                </a>
              </li>
              <li className="flex items-start">
                <PhoneIcon className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">+55 (11) 98765-4321</span>
              </li>
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">São Paulo, Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} IdeaFlow. Todos os direitos reservados.
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center text-gray-500 hover:text-teal-400 transition-colors"
          >
            <HeartIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">Feito com carinho no Brasil</span>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;