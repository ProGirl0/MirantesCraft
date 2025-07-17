import { motion } from 'framer-motion';
import { 
  LightBulbIcon,
  ChartBarIcon,
  RocketLaunchIcon 
} from '@heroicons/react/24/outline';
import AnimatedCard from '../components/ui/AnimatedCard';
import Footer from '../components/ui/Footer';
import ConstellationCanvas from '../components/ui/Constelation';
import AnimatedButton from '../components/ui/Button';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/ui/FeaturedCard';

// Imagem de background (substitua pela sua URL)
const backgroundImage = 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80';

const HomePage = () => {

  const features = [
    {
      icon: <LightBulbIcon className="h-8 w-8 text-teal-500" />,
      title: 'Brainstorming Digital',
      description: 'Capture ideias como se estivesse desenhando em um papel'
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-teal-500" />,
      title: 'Gestão Visual',
      description: 'Organize projetos com nosso sistema de quadros inteligentes'
    },
    {
      icon: <RocketLaunchIcon className="h-8 w-8 text-teal-500" />,
      title: 'Execução Rápida',
      description: 'Transforme ideias em tarefas acionáveis em minutos'
    }
  ];

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      {/* Background com overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
        <ConstellationCanvas />
        
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Seção Hero */}
        <div className="text-center mb-20 relative">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-extrabold mb-6 font-[Inter]"
            style={{ textShadow: '0 4px 20px rgba(45, 212, 191, 0.3)' }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-600">
              Mirantes Craft
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
          >
            Transforme ideias em resultados <span className="text-teal-400">com fluidez</span>
          </motion.p>
        </div>
        {/* Renderizar cada feature em sua própria seção, lado a lado */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {features.map((feature, index) => (
            <section key={index} className="py-16 bg-gray-900/50">
              <div className="container mx-auto px-4">
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index}
                />
              </div>
            </section>
          ))}
        </div>
      </div>
      <Footer />
      <div className="absolute top-6 right-8 z-20">
        <Link to="/login">
          <AnimatedButton
            variant="primary"
            size="large"
            icon={ArrowRightIcon}
            iconPosition="right"
            fullWidth={false}
            onClick={() => {}}
          >
            Entrar na plataforma
          </AnimatedButton>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;