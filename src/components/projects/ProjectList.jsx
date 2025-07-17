import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../auth/useAuth';

export const ProjectList = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const fetchProjects = async () => {
      try {
        // Busca projetos onde o usuário é membro ou owner
        const q = query(
          collection(db, 'projects'),
          where('members', 'array-contains', user.email)
        );
        const q2 = query(
          collection(db, 'projects'),
          where('ownerId', '==', user.uid)
        );
        const [snap1, snap2] = await Promise.all([getDocs(q), getDocs(q2)]);
        const data1 = snap1.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const data2 = snap2.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Remove duplicados
        const all = [...data1, ...data2.filter(p => !data1.some(p1 => p1.id === p.id))];
        setProjects(all);
      } catch (err) {
        setError('Erro ao carregar projetos');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  if (loading) return <div>Carregando projetos...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>Projetos</h3>
        <Link to="/projects/new" className="bg-blue-600 text-white px-3 py-1 rounded">Novo Projeto</Link>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {projects.length === 0 && <li>Nenhum projeto encontrado.</li>}
        {projects.map(p => (
          <li key={p.id} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, marginBottom: 10, padding: 12 }}>
            <Link to={`/projects/${p.id}`} style={{ fontWeight: 'bold', color: '#2563eb', textDecoration: 'none' }}>{p.title}</Link>
            <div style={{ fontSize: 13, color: '#555' }}>{p.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};