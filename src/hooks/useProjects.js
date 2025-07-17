import { useEffect, useState } from 'react';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useCurrentUser } from './useCurrentUser';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useCurrentUser();

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, 'projects'),
      async (snapshot) => {
        const projectsData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const project = { id: docSnap.id, ...docSnap.data() };
            // Buscar tarefas da subcoleção
            const tasksSnap = await getDocs(collection(db, 'projects', docSnap.id, 'tasks'));
            project.tasks = tasksSnap.docs.map(taskDoc => ({ id: taskDoc.id, ...taskDoc.data() }));
            return project;
          })
        );
        // Filtrar projetos: só mostrar se o usuário é owner ou membro
        const filtered = projectsData.filter(project =>
          project.ownerId === user.uid || (Array.isArray(project.members) && project.members.includes(user.email))
        );
        setProjects(filtered);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setProjects([]);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  return { projects, loading, error };
} 