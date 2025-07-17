import { Link, useParams, useNavigate } from 'react-router-dom';
import TaskBoard from '../components/tasks/taskBoard';
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { FolderIcon, UsersIcon, CalendarIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const ProjectsDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !projectId) return;
    setLoading(true);
    setError('');
    const fetchProject = async () => {
      try {
        const ref = doc(db, 'projects', projectId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProject({ id: snap.id, ...snap.data() });
        } else {
          setError('Projeto não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar projeto');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [user, projectId]);

  // Permissão: só membros ou dono podem acessar
  const isMember = project && (
    (project.members || []).includes(user?.email) || user?.uid === project.ownerId || (project.members || []).length === 0
  );

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto? Essa ação não pode ser desfeita.')) return;
    try {
      // Excluir todas as tarefas do projeto
      const tasksRef = collection(db, 'projects', projectId, 'tasks');
      const tasksSnap = await getDocs(tasksRef);
      const deleteTasks = tasksSnap.docs.map(docu => deleteDoc(docu.ref));
      await Promise.all(deleteTasks);
      // Excluir o projeto
      await deleteDoc(doc(db, 'projects', projectId));
      navigate('/dashboard');
    } catch (err) {
      alert('Erro ao excluir projeto');
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!project) return null;
  if (!isMember) return <div style={{ color: 'red' }}>Você não tem permissão para acessar este projeto.</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="bg-gray-800/80 border border-gray-700 p-8 mb-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center h-14 w-14 bg-teal-400/10 border border-teal-400/30">
            <FolderIcon className="h-8 w-8 text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-white truncate mb-1">{project.title}</h2>
            <p className="text-gray-400 text-sm line-clamp-2">{project.description || 'Sem descrição disponível'}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CalendarIcon className="h-5 w-5 text-teal-400" />
            <span><b>Início:</b> {project.startDate || '-'}</span>
            <span className="ml-2"><b>Fim:</b> {project.endDate || '-'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <UsersIcon className="h-5 w-5 text-teal-400" />
            <span><b>Membros:</b> {(project.members || []).length === 0 ? 'Nenhum membro' : (project.members || []).join(', ')}</span>
          </div>
        </div>
        <div className="flex gap-3 mb-6">
          <Link to={`/projects/${project.id}/edit`} className="inline-flex items-center gap-1 bg-teal-400/10 border border-teal-400/30 px-4 py-2 font-medium transition-colors text-teal-500 hover:bg-teal-400/20">
            <PencilIcon className="h-5 w-5" /> Editar Projeto
          </Link>
          <Link to={`/projects/${project.id}/tasks/new`} className="inline-flex items-center gap-1 bg-teal-400/10 border border-teal-400/30 px-4 py-2 font-medium transition-colors text-teal-500 hover:bg-teal-400/20">
            <PlusIcon className="h-5 w-5" /> Nova Tarefa
          </Link>
          <button onClick={handleDelete} className="inline-flex items-center gap-1 bg-teal-400/10 border border-teal-400/30 px-4 py-2 font-medium transition-colors text-teal-500 hover:bg-teal-400/20">
            <TrashIcon className="h-5 w-5" /> Excluir Projeto
          </button>
        </div>
      </div>
      <div className="bg-gray-800/70 border border-gray-700 p-6">
        <TaskBoard projectId={project.id} />
      </div>
    </div>
  );
};

export default ProjectsDetailsPage;
