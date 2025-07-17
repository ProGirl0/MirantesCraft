import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useNotifications } from '../components/notifications/NotificationProvider';
import { FolderIcon, UsersIcon, CalendarIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProjectFormPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const isEdit = Boolean(projectId);
  const user = useCurrentUser();
  const { notifyProjectMemberAdded } = useNotifications();
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    members: [],
    newMember: '',
    ownerId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(true);

  useEffect(() => {
    if (isEdit && user) {
      setLoading(true);
      const fetchProject = async () => {
        try {
          const ref = doc(db, 'projects', projectId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            setForm(f => ({ ...f, ...data, newMember: '' }));
            setIsOwner(data.ownerId ? data.ownerId === user.uid : true);
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
    } else if (!isEdit && user) {
      setIsOwner(true);
    }
  }, [isEdit, user, projectId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAddMember = e => {
    e.preventDefault();
    const email = form.newMember.trim().toLowerCase();
    if (!email || form.members.includes(email)) return;
    setForm(f => ({ ...f, members: [...f.members, email], newMember: '' }));
  };

  const handleRemoveMember = email => {
    setForm(f => ({ ...f, members: f.members.filter(m => m !== email) }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const data = { ...form };
      delete data.newMember;
      
      if (!isEdit) {
        data.ownerId = user.uid;
        // Garante que o criador está na lista de membros
        if (!data.members.includes(user.email)) {
          data.members = [...data.members, user.email];
        }
        const ref = collection(db, 'projects');
        const projectDoc = await addDoc(ref, data);
        
        // Notificar membros adicionados (exceto o criador)
        const membersToNotify = data.members.filter(email => email !== user.email);
        for (const memberEmail of membersToNotify) {
          try {
            const userQuery = query(collection(db, 'users'), where('email', '==', memberEmail));
            const userSnap = await getDocs(userQuery);
            if (!userSnap.empty) {
              const memberUser = userSnap.docs[0].data();
              await notifyProjectMemberAdded(projectDoc.id, data.title, user.email, memberUser);
            }
          } catch (error) {
            console.error('Erro ao notificar membro:', error);
          }
        }
      } else {
        // Para edição, verificar novos membros adicionados
        const projectRef = doc(db, 'projects', projectId);
        const projectSnap = await getDoc(projectRef);
        const oldProject = projectSnap.data();
        const oldMembers = oldProject?.members || [];
        const newMembers = data.members.filter(email => !oldMembers.includes(email));
        
        await updateDoc(projectRef, data);
        
        // Notificar apenas novos membros
        for (const memberEmail of newMembers) {
          try {
            const userQuery = query(collection(db, 'users'), where('email', '==', memberEmail));
            const userSnap = await getDocs(userQuery);
            if (!userSnap.empty) {
              const memberUser = userSnap.docs[0].data();
              await notifyProjectMemberAdded(projectId, data.title, user.email, memberUser);
            }
          } catch (error) {
            console.error('Erro ao notificar membro:', error);
          }
        }
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao salvar projeto');
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
            <FolderIcon className="h-6 w-6 text-teal-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{isEdit ? 'Editar Projeto' : 'Novo Projeto'}</h2>
            <p className="text-gray-400 text-sm">Preencha os detalhes do projeto</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="Digite o título do projeto" 
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
              placeholder="Descreva o projeto em detalhes" 
              rows="4"
              className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-3 focus:outline-none focus:border-teal-400 resize-none" 
            />
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
                  required 
                  className="flex-1 bg-gray-700 border border-gray-600 text-white p-3 focus:outline-none focus:border-teal-400" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Data de Fim</label>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-teal-400" />
                <input 
                  name="endDate" 
                  type="date" 
                  value={form.endDate} 
                  onChange={handleChange} 
                  required 
                  className="flex-1 bg-gray-700 border border-gray-600 text-white p-3 focus:outline-none focus:border-teal-400" 
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Membros</label>
            <div className="bg-gray-700 border border-gray-600 p-4">
              {form.members.length > 0 ? (
                <div className="space-y-2 mb-4">
            {form.members.map(email => (
                    <div key={email} className="flex items-center justify-between bg-gray-600 p-2">
                      <span className="text-white text-sm">{email}</span>
                {isOwner && email !== form.ownerId && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveMember(email)} 
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm mb-4">Nenhum membro adicionado</p>
              )}
              
          {isOwner && (
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <UsersIcon className="h-5 w-5 text-teal-400" />
              <input
                name="newMember"
                value={form.newMember}
                onChange={handleChange}
                placeholder="Adicionar membro por email"
                      className="flex-1 bg-gray-600 border border-gray-500 text-white placeholder-gray-400 p-2 focus:outline-none focus:border-teal-400"
                type="email"
              />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddMember} 
                    className="flex items-center gap-1 bg-teal-400/10 border border-teal-400/30 px-3 py-2 text-teal-500 hover:bg-teal-400/20 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Adicionar
                  </button>
            </div>
          )}
        </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-teal-400/10 border border-teal-400/30 px-6 py-3 font-medium transition-colors text-teal-500 hover:bg-teal-400/20 disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={loading}
            >
              <FolderIcon className="h-5 w-5" />
          {isEdit ? 'Salvar Alterações' : 'Criar Projeto'}
        </button>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
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

export default ProjectFormPage; 