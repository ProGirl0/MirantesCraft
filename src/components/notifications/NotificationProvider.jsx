import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const user = useCurrentUser();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Buscar notificações do usuário
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', user.uid),
      where('deleted', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
      
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    });

    return unsubscribe;
  }, [user]);

  // Criar notificação
  const createNotification = async (data) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...data,
        createdAt: serverTimestamp(),
        read: false,
        deleted: false
      });
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  };

  // Marcar como lida
  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      const updates = unreadNotifications.map(notification =>
        updateDoc(doc(db, 'notifications', notification.id), { read: true })
      );
      await Promise.all(updates);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  // Deletar notificação
  const deleteNotification = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        deleted: true
      });
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  // Funções específicas para diferentes tipos de notificação
  const notifyProjectMemberAdded = async (projectId, projectTitle, addedBy, addedUser) => {
    await createNotification({
      type: 'project_member_added',
      title: 'Você foi adicionado a um projeto',
      message: `${addedBy} adicionou você ao projeto "${projectTitle}"`,
      recipientId: addedUser.uid,
      projectId,
      addedBy,
      projectTitle
    });
  };

  const notifyTaskCreated = async (projectId, projectTitle, taskTitle, createdBy, assigneeId) => {
    await createNotification({
      type: 'task_created',
      title: 'Nova tarefa atribuída',
      message: `${createdBy} criou a tarefa "${taskTitle}" no projeto "${projectTitle}"`,
      recipientId: assigneeId,
      projectId,
      taskTitle,
      createdBy,
      projectTitle
    });
  };

  const notifyTaskStatusChanged = async (projectId, projectTitle, taskTitle, changedBy, assigneeId, newStatus) => {
    await createNotification({
      type: 'task_status_changed',
      title: 'Status da tarefa alterado',
      message: `${changedBy} alterou o status da tarefa "${taskTitle}" para "${newStatus}"`,
      recipientId: assigneeId,
      projectId,
      taskTitle,
      changedBy,
      projectTitle,
      newStatus
    });
  };

  const notifyTaskDueDate = async (projectId, projectTitle, taskTitle, assigneeId, dueDate) => {
    await createNotification({
      type: 'task_due_date',
      title: 'Prazo de tarefa próximo',
      message: `A tarefa "${taskTitle}" vence em ${dueDate}`,
      recipientId: assigneeId,
      projectId,
      taskTitle,
      projectTitle,
      dueDate
    });
  };

  const notifyTaskOverdue = async (projectId, projectTitle, taskTitle, assigneeId) => {
    await createNotification({
      type: 'task_overdue',
      title: 'Tarefa vencida',
      message: `A tarefa "${taskTitle}" está vencida`,
      recipientId: assigneeId,
      projectId,
      taskTitle,
      projectTitle
    });
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      createNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      notifyProjectMemberAdded,
      notifyTaskCreated,
      notifyTaskStatusChanged,
      notifyTaskDueDate,
      notifyTaskOverdue
    }}>
      {children}
    </NotificationContext.Provider>
  );
}; 