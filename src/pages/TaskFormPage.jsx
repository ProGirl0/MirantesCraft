import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../components/auth/useAuth';
import { useNotifications } from '../components/notifications/NotificationProvider';
import { DocumentTextIcon, UserIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const TaskFormPage = () => {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();
  const isEdit = Boolean(taskId);
  const { user } = useAuth();
  const { notifyTaskCreated } = useNotifications();
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignee: '',
    status: 'todo',
    startDate: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assigneeSuggestions, setAssigneeSuggestions] = useState([]);

  useEffect(() => {
    if (isEdit && user && projectId) {
      setLoading(true);
      const fetchTask = async () => {
        try {
          const ref = doc(db, 'projects', projectId, 'tasks', taskId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setForm({ ...snap.data() });
          } else {
            setError('Tarefa não encontrada');
          }
        } catch (err) {
          setError('Erro ao carregar tarefa');
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [isEdit, user, projectId, taskId]);

  // Buscar sugestões de emails conforme digita
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!form.assignee || form.assignee.length < 2) {
        setAssigneeSuggestions([]);
        return;
      }
      const search = form.assignee.toLowerCase();
      const q = query(collection(db, 'users'), where('email', '>=', search), where('email', '<=', search + '\uf8ff'));
      const snap = await getDocs(q);
      setAssigneeSuggestions(snap.docs.map(d => d.data().email));
    };
    fetchSuggestions();
  }, [form.assignee]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSelectAssignee = email => {
    setForm(f => ({ ...f, assignee: email }));
    setAssigneeSuggestions([]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user || !projectId) return;
    setLoading(true);
    setError('');
    try {
      // Permite salvar se o assignee for o usuário logado ou qualquer sugestão (case-insensitive)
      const assigneeLower = form.assignee.toLowerCase();
      const valid = assigneeSuggestions.some(email => email.toLowerCase() === assigneeLower) || assigneeLower === user.email.toLowerCase();
      if (!valid) {
        setError('Selecione um responsável válido da lista.');
        setLoading(false);
        return;
      }
      
      if (isEdit) {
        const ref = doc(db, 'projects', projectId, 'tasks', taskId);
        await updateDoc(ref, form);
      } else {
        const ref = collection(db, 'projects', projectId, 'tasks');
        await addDoc(ref, form);
        
        // Notificar o responsável pela tarefa (se não for o criador)
        if (form.assignee && form.assignee.toLowerCase() !== user.email.toLowerCase()) {
          try {
            const userQuery = query(collection(db, 'users'), where('email', '==', form.assignee));
            const userSnap = await getDocs(userQuery);
            if (!userSnap.empty) {
              const assigneeUser = userSnap.docs[0].data();
              
              // Buscar informações do projeto
              const projectRef = doc(db, 'projects', projectId);
              const projectSnap = await getDoc(projectRef);
              const projectData = projectSnap.data();
              
              await notifyTaskCreated(
                projectId, 
                projectData?.title || 'Projeto', 
                form.title, 
                user.email, 
                assigneeUser.uid
              );
            }
          } catch (error) {
            console.error('Erro ao notificar responsável:', error);
          }
        }
      }
      
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError('Erro ao salvar tarefa');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <div className="bg-gray-800/80 border border-gray-700 p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center h-12 w-12 bg-teal-400/10 border border-teal-400/30">
            <DocumentTextIcon className="h-6 w-6 text-teal-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{isEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
            <p className="text-gray-400 text-sm">Preencha os detalhes da tarefa</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="Digite o título da tarefa" 
              required 
              className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-3 focus:outline-none focus:border-teal-400" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Descreva a tarefa em detalhes" 
              rows="4"
              className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-3 focus:outline-none focus:border-teal-400 resize-none" 
            />
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Responsável</label>
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-teal-400" />
          <input
            name="assignee"
            value={form.assignee}
            onChange={handleChange}
                placeholder="Digite o email do responsável"
                className="flex-1 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-3 focus:outline-none focus:border-teal-400"
            type="email"
            autoComplete="off"
          />
            </div>
          {assigneeSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-gray-700 border border-gray-600 w-full max-h-32 overflow-y-auto mt-1">
              {assigneeSuggestions.map(email => (
                  <li 
                    key={email} 
                    className="px-3 py-2 cursor-pointer hover:bg-gray-600 text-white text-sm" 
                    onClick={() => handleSelectAssignee(email)}
                  >
                    {email}
                  </li>
              ))}
            </ul>
          )}
          {form.assignee.length >= 2 && assigneeSuggestions.length === 0 && (
              <div className="text-red-400 text-sm mt-1">Nenhum usuário encontrado</div>
          )}
        </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select 
              name="status" 
              value={form.status} 
              onChange={handleChange} 
              className="w-full bg-gray-700 border border-gray-600 text-white p-3 focus:outline-none focus:border-teal-400"
            >
          <option value="todo">A Fazer</option>
          <option value="inprogress">Em Progresso</option>
          <option value="done">Concluída</option>
        </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Data de Início</label>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-teal-400" />
                <input 
                  name="startDate" 
                  type="date" 
                  value={form.startDate} 
                  onChange={handleChange} 
                  className="flex-1 bg-gray-700 border border-gray-600 text-white p-3 focus:outline-none focus:border-teal-400" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Data de Fim</label>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-teal-400" />
                <input 
                  name="dueDate" 
                  type="date" 
                  value={form.dueDate} 
                  onChange={handleChange} 
                  className="flex-1 bg-gray-700 border border-gray-600 text-white p-3 focus:outline-none focus:border-teal-400" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-teal-400/10 border border-teal-400/30 px-6 py-3 font-medium transition-colors text-teal-500 hover:bg-teal-400/20 disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={loading}
            >
              <CheckCircleIcon className="h-5 w-5" />
          {isEdit ? 'Salvar Alterações' : 'Criar Tarefa'}
        </button>
            <button 
              type="button" 
              onClick={() => navigate(`/projects/${projectId}`)}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
      </form>
      </div>
    </div>
  );
};

export default TaskFormPage; 