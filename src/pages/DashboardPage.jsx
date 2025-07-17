import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useAuth } from '../components/auth/useAuth';
import AnimatedButton from '../components/ui/Button';
import NotificationBell from '../components/notifications/NotificationBell';

import { 
  UserCircleIcon, 
  ArrowRightIcon, 
  ArrowLeftOnRectangleIcon as LogoutIcon,
  FolderIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  UserGroupIcon as UsersIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useProjects } from '../hooks/useProjects'; // Adicione este hook

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const DashboardPage = () => {
  const { user, loading, logout } = useAuth();
  const { projects, loading: loadingProjects } = useProjects(); // Busca projetos reais
  const navigate = useNavigate();
  const hasRedirected = useRef(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!loading && !user && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading || loadingProjects) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) return null;

  // Calcular estatísticas reais
  const totalProjects = projects?.length || 0;
  const totalTasks = projects?.reduce((sum, project) => sum + (project.tasks?.length || 0), 0) || 0;
  const completedTasks = projects?.reduce((sum, project) => {
    return sum + (project.tasks?.filter(task => task.status === 'done').length || 0);
  }, 0) || 0;

  // --- GRÁFICO 1: Projetos ---
  // Para cada projeto, calcular % concluído, a fazer, em progresso
  const projectLabels = projects?.map(p => p.name || p.title || 'Sem nome') || [];
  const projectDone = projects?.map(p => {
    const tasks = Array.isArray(p.tasks) ? p.tasks : [];
    const total = tasks.length || 1;
    return (tasks.filter(t => (t.status || '').toLowerCase() === 'done').length / total) * 100;
  }) || [];
  const projectTodo = projects?.map(p => {
    const tasks = Array.isArray(p.tasks) ? p.tasks : [];
    const total = tasks.length || 1;
    return (tasks.filter(t => (t.status || '').toLowerCase() === 'todo').length / total) * 100;
  }) || [];
  const projectInProgress = projects?.map(p => {
    const tasks = Array.isArray(p.tasks) ? p.tasks : [];
    const total = tasks.length || 1;
    return (tasks.filter(t => (t.status || '').toLowerCase() === 'inprogress').length / total) * 100;
  }) || [];
  const projectLineData = {
    labels: projectLabels,
    datasets: [
      {
        label: '% Concluído',
        data: projectDone,
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20,184,166,0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: '% Em Progresso',
        data: projectInProgress,
        borderColor: '#facc15',
        backgroundColor: 'rgba(250,204,21,0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: '% A Fazer',
        data: projectTodo,
        borderColor: '#64748b',
        backgroundColor: 'rgba(100,116,139,0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const projectLineOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#99f6e4' } },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: '#99f6e4', callback: v => v + '%' },
        grid: { color: 'rgba(45,212,191,0.1)' },
      },
      x: {
        ticks: { color: '#99f6e4' },
        grid: { color: 'rgba(45,212,191,0.1)' },
      },
    },
  };

  // --- GRÁFICO 2: Tarefas a Fazer por prioridade ---
  const allTasks = projects?.flatMap(p => p.tasks?.map(t => ({...t, project: p.name})) || []) || [];
  const priorities = ['alta', 'media', 'baixa'];
  const todoTasks = allTasks.filter(t => t.status === 'todo');
  const todoByPriority = priorities.map(prio => todoTasks.filter(t => (t.priority || 'media') === prio).length);
  const todoLineData = {
    labels: priorities.map(p => p.charAt(0).toUpperCase() + p.slice(1)),
    datasets: [
      {
        label: 'Tarefas a Fazer',
        data: todoByPriority,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const todoLineOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#99f6e4' } },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#99f6e4' },
        grid: { color: 'rgba(45,212,191,0.1)' },
      },
      x: {
        ticks: { color: '#99f6e4' },
        grid: { color: 'rgba(45,212,191,0.1)' },
      },
    },
  };

  // --- GRÁFICO 3: Tarefas Feitas por data de conclusão ---
  const doneTasks = allTasks.filter(t => t.status === 'done');
  // Agrupar por data de conclusão (supondo campo completedAt ou dueDate)
  const doneByDate = {};
  doneTasks.forEach(t => {
    const date = t.completedAt || t.dueDate || 'Sem data';
    const key = date ? new Date(date).toLocaleDateString('pt-BR') : 'Sem data';
    doneByDate[key] = (doneByDate[key] || 0) + 1;
  });
  const doneDates = Object.keys(doneByDate);
  const doneCounts = Object.values(doneByDate);
  const doneLineData = {
    labels: doneDates,
    datasets: [
      {
        label: 'Tarefas Feitas',
        data: doneCounts,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const doneLineOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#99f6e4' } },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#99f6e4' },
        grid: { color: 'rgba(45,212,191,0.1)' },
      },
      x: {
        ticks: { color: '#99f6e4' },
        grid: { color: 'rgba(45,212,191,0.1)' },
      },
    },
  };

  // --- GRÁFICO 4: Em Progresso por data de início ---
  const inprogressTasks = allTasks.filter(t => t.status === 'inprogress');
  const inprogressByDate = {};
  inprogressTasks.forEach(t => {
    const date = t.startDate || 'Sem data';
    const key = date ? new Date(date).toLocaleDateString('pt-BR') : 'Sem data';
    inprogressByDate[key] = (inprogressByDate[key] || 0) + 1;
  });
  const inprogressDates = Object.keys(inprogressByDate);
  const inprogressCounts = Object.values(inprogressByDate);
  const inprogressLineData = {
    labels: inprogressDates,
    datasets: [
      {
        label: 'Em Progresso',
        data: inprogressCounts,
        borderColor: '#f59e42',
        backgroundColor: 'rgba(245,158,66,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const inprogressLineOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#99f6e4' } },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#99f6e4' },
        grid: { color: 'rgba(45,212,191,0.1)' },
      },
      x: {
        ticks: { color: '#99f6e4' },
        grid: { color: 'rgba(45,212,191,0.1)' },
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-dark text-white overflow-hidden">
      
      
      <header className="relative z-20 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FolderIcon className="h-8 w-8 text-teal-400" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-600">
              IdeaFlow
            </h1>
          </motion.div>

          <div className="flex items-center gap-4">
            <NotificationBell />
          <div className="relative" ref={dropdownRef}>
            <AnimatedButton
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              variant="ghost"
              size="small"
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserCircleIcon className="h-6 w-6" />
            </AnimatedButton>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 shadow-lg"
                >
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm text-gray-300">Logado como</p>
                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                  >
                    <LogoutIcon className="h-4 w-4" />
                    Sair
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Botão adicionar projeto no topo à direita */}
        
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-teal-400">Dashboard</h1>
            <AnimatedButton 
              onClick={() => navigate('/projects/new')}
              size="small"
              className="flex items-center gap-1"
            >
              <FolderIcon className="h-4 w-4" />
              Novo Projeto
            </AnimatedButton>
          </div>

        {/* Gráficos organizados conforme solicitado */}
        <div className="flex flex-wrap gap-20 mb-8 min-h-[320px]">
          {/* Coluna da esquerda: Projetos */}
          <div className="bg-gray-800/80 border border-gray-700 p-4 flex flex-col justify-between" style={{ flexBasis: '50%', minWidth: 320, height: '90%' }}>
            <h2 className="text-lg font-semibold mb-2 text-teal-400">Projetos</h2>
            <div className="flex-1 min-h-[250px]">
              <Line data={projectLineData} options={projectLineOptions} />
            </div>
          </div>
          {/* Coluna da direita: Tarefas a Fazer em cima, Feitas e Em Progresso embaixo */}
          <div className="flex flex-col gap-4" style={{ flexBasis: '40%', minWidth: 320 }}>
            <div className="bg-gray-800/80 w-full border border-gray-700 p-4" style={{ height: '44%' }}>
              <h2 className="text-lg font-semibold mb-2 text-teal-400">Tarefas a Fazer</h2>
              <div className="h-32">
                <Line data={todoLineData} options={todoLineOptions} />
              </div>
            </div>
            <div className="flex gap-4" style={{ height: '40%' }}>
              <div className="bg-gray-800/80 border border-gray-700 p-4 flex-1" style={{ minWidth: 120 }}>
                <h2 className="text-lg font-semibold mb-2 text-teal-400">Tarefas Feitas</h2>
                <div className="h-32">
                  <Line data={doneLineData} options={doneLineOptions} />
                </div>
              </div>
              <div className="bg-gray-800/80 border border-gray-700 p-4 flex-1" style={{ minWidth: 120 }}>
                <h2 className="text-lg font-semibold mb-2 text-teal-400">Em Progresso</h2>
                <div className="h-32">
                  <Line data={inprogressLineData} options={inprogressLineOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-teal-400">Meus Projetos</h1>
            
          </div>
          
          {projects?.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 overflow-x-auto">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  style={{ minWidth: 300 }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="bg-gray-800/80 border border-gray-700 p-6 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:border-teal-400 group"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 bg-teal-400/10 border border-teal-400/30 group-hover:bg-teal-400/20 transition-colors">
                        <FolderIcon className="h-6 w-6 text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors line-clamp-1">
                          {project.name}
                        </h3>
                        <p className="text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <UsersIcon className="h-4 w-4" />
                          <span>{project.members?.length || 0} membros</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DocumentTextIcon className="h-4 w-4" />
                          <span>{project.tasks?.length || 0} tarefas</span>
                        </div>
                      </div>
                      <ArrowRightIcon className="h-5 w-5 text-gray-500 group-hover:text-teal-400 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 p-8 text-center">
              <FolderIcon className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-400">Nenhum projeto encontrado</h3>
              <p className="mt-2 text-gray-500">Comece criando seu primeiro projeto</p>
              <div className="mt-6">
                <AnimatedButton 
                  onClick={() => navigate('/projects/new')}
                  variant="primary"
                  size="medium"
                >
                  Criar Projeto
                </AnimatedButton>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};