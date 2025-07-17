import { useEffect, useState } from 'react';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setProjects(projectsData);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setProjects([]);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { projects, loading, error };
} 