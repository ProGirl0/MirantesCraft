import { useEffect } from 'react';
import { useNotifications } from './NotificationProvider';
import { useAuth } from '../auth/useAuth';
import { db } from '../../firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

const DueDateChecker = () => {
  const { user } = useAuth();
  const { notifyTaskDueDate, notifyTaskOverdue } = useNotifications();

  useEffect(() => {
    if (!user) return;

    // Verificar prazos a cada 30 minutos
    const checkDueDates = async () => {
      try {
        // Buscar todas as tarefas do usuário
        const tasksQuery = query(
          collection(db, 'projects'),
          where('members', 'array-contains', user.email)
        );

        const unsubscribe = onSnapshot(tasksQuery, async (projectsSnapshot) => {
          for (const projectDoc of projectsSnapshot.docs) {
            const project = projectDoc.data();
            const tasksQuery = query(
              collection(db, 'projects', projectDoc.id, 'tasks'),
              where('assignee', '==', user.email)
            );

            const tasksSnapshot = await getDocs(tasksQuery);
            const now = new Date();

            tasksSnapshot.docs.forEach(taskDoc => {
              const task = taskDoc.data();
              if (!task.dueDate) return;

              const dueDate = new Date(task.dueDate);
              const diffInHours = (dueDate - now) / (1000 * 60 * 60);

              // Notificar se vence em 24h
              if (diffInHours > 0 && diffInHours <= 24) {
                notifyTaskDueDate(
                  projectDoc.id,
                  project.title,
                  task.title,
                  user.uid,
                  dueDate.toLocaleDateString('pt-BR')
                );
              }

              // Notificar se está vencida
              if (diffInHours < 0 && task.status !== 'done') {
                notifyTaskOverdue(
                  projectDoc.id,
                  project.title,
                  task.title,
                  user.uid
                );
              }
            });
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error('Erro ao verificar prazos:', error);
      }
    };

    // Verificar imediatamente
    checkDueDates();

    // Verificar a cada 30 minutos
    const interval = setInterval(checkDueDates, 30 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [user, notifyTaskDueDate, notifyTaskOverdue]);

  return null; // Componente invisível
};

export default DueDateChecker; 