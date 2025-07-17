import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import TaskItem from './taskItem';
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc, writeBatch, query, where } from 'firebase/firestore';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useNotifications } from '../notifications/NotificationProvider';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const columns = [
  { id: 'todo', title: 'A Fazer' },
  { id: 'inprogress', title: 'Em Progresso' },
  { id: 'done', title: 'Concluída' },
];

const DroppableColumn = ({ id, children, title }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className="bg-gray-800/80 border border-gray-700 p-4 min-w-[320px] h-[600px] flex flex-col"
    >
      <div className="flex items-center justify-center gap-2 mb-4 flex-shrink-0">
        <ClipboardDocumentListIcon className="h-5 w-5 text-teal-400" />
        <h3 className="text-lg font-semibold text-white text-center">{title}</h3>
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        {children}
      </div>
    </div>
  );
};

const TaskBoard = ({ projectId }) => {
  const user = useCurrentUser();
  const { notifyTaskStatusChanged } = useNotifications();
  const [tasks, setTasks] = useState({ todo: [], inprogress: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [alert, setAlert] = useState('');
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!user || !projectId) return;
    const fetchProject = async () => {
      const ref = doc(db, 'projects', projectId);
      const snap = await getDoc(ref);
      if (snap.exists()) setProject(snap.data());
    };
    fetchProject();
  }, [user, projectId]);

  useEffect(() => {
    if (!user || !projectId) return;
    setLoading(true);
    setError(null);
    const fetchTasks = async () => {
      try {
        const q = collection(db, 'projects', projectId, 'tasks');
        const snapshot = await getDocs(q);
        const allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sortedTasks = allTasks.sort((a, b) => (a.order || 0) - (b.order || 0));
        setTasks({
          todo: sortedTasks.filter(t => t.status === 'todo'),
          inprogress: sortedTasks.filter(t => t.status === 'inprogress'),
          done: sortedTasks.filter(t => t.status === 'done'),
        });
      } catch {
        setError('Erro ao carregar tarefas');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user, projectId]);



  const handleDragStart = (event) => {
    const { active } = event;
    const task = findTaskById(active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || !active) return;
    const activeTask = findTaskById(active.id);
    if (!activeTask) return;
    // Descobrir coluna de origem e destino
    let sourceCol = null, destCol = null;
    for (const col of columns) {
      if (tasks[col.id].some(t => t.id === active.id)) sourceCol = col.id;
      if (tasks[col.id].some(t => t.id === over.id)) destCol = col.id;
    }
    // Se não achou destino, pode ser drop em coluna vazia
    if (!destCol && columns.some(col => col.id === over.id)) destCol = over.id;
    if (!sourceCol || !destCol) return;
    // Permissões
    const isPM = project && user && project.ownerId === user.uid;
    const isResponsible = activeTask.assignee === user.email;
    if (destCol === 'done' && !isPM) {
      setAlert('Só o PM pode dar uma task por concluída!');
      setTimeout(() => setAlert(''), 3000);
      return;
    }
    if (!isPM && !isResponsible) {
      setAlert('Você só pode mover tarefas pelas quais é responsável.');
      setTimeout(() => setAlert(''), 3000);
      return;
    }
    // Mesma coluna: reordenar
    if (sourceCol === destCol) {
      const colTasks = tasks[sourceCol];
      const oldIndex = colTasks.findIndex(t => t.id === active.id);
      let newIndex = colTasks.findIndex(t => t.id === over.id);
      if (newIndex === -1) newIndex = colTasks.length - 1;
      const newColTasks = arrayMove(colTasks, oldIndex, newIndex);
      setTasks(prev => ({ ...prev, [sourceCol]: newColTasks }));
      // Atualizar ordem no Firestore
      const batch = writeBatch(db);
      newColTasks.forEach((task, idx) => {
        const ref = doc(db, 'projects', projectId, 'tasks', task.id);
        batch.update(ref, { order: idx });
      });
      await batch.commit();
      return;
    }
    // Entre colunas
    const sourceTasks = tasks[sourceCol].filter(t => t.id !== active.id);
    const destTasks = [...tasks[destCol]];
    let destIndex = destTasks.findIndex(t => t.id === over.id);
    if (destIndex === -1) destIndex = destTasks.length;
    const movedTask = { ...activeTask, status: destCol };
    destTasks.splice(destIndex, 0, movedTask);
    setTasks(prev => ({
      ...prev,
      [sourceCol]: sourceTasks,
      [destCol]: destTasks,
    }));
    
    // Atualizar no Firestore
    const batch = writeBatch(db);
    sourceTasks.forEach((task, idx) => {
      const ref = doc(db, 'projects', projectId, 'tasks', task.id);
      batch.update(ref, { order: idx });
    });
    destTasks.forEach((task, idx) => {
      const ref = doc(db, 'projects', projectId, 'tasks', task.id);
      batch.update(ref, { order: idx, status: destCol });
    });
    await batch.commit();
    
    // Notificar mudança de status (se o responsável não for quem moveu)
    if (activeTask.assignee && activeTask.assignee !== user.email) {
      try {
        const userQuery = query(collection(db, 'users'), where('email', '==', activeTask.assignee));
        const userSnap = await getDocs(userQuery);
        if (!userSnap.empty) {
          const assigneeUser = userSnap.docs[0].data();
          const statusLabels = {
            'todo': 'A Fazer',
            'inprogress': 'Em Progresso',
            'done': 'Concluída'
          };
          
          await notifyTaskStatusChanged(
            projectId,
            project?.title || 'Projeto',
            activeTask.title,
            user.email,
            assigneeUser.uid,
            statusLabels[destCol] || destCol
          );
        }
      } catch (error) {
        console.error('Erro ao notificar mudança de status:', error);
      }
    }
  };

  const findTaskById = (taskId) => {
    for (const status in tasks) {
      const task = tasks[status].find(t => t.id === taskId);
      if (task) return task;
    }
    return null;
  };

  const handleDeleteTask = (taskId, status) => {
    setTasks(prev => ({
      ...prev,
      [status]: prev[status].filter(t => t.id !== taskId)
    }));
  };

  if (loading) return <div>Carregando tarefas...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <>
      {alert && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 mb-4">
          {alert}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map(col => (
            <DroppableColumn key={col.id} id={col.id} title={col.title}>
              <SortableContext
                items={tasks[col.id].map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {tasks[col.id].map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    projectId={projectId} 
                    onDelete={handleDeleteTask} 
                  />
                ))}
              </SortableContext>
            </DroppableColumn>
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <TaskItem 
              task={activeTask} 
              projectId={projectId} 
              onDelete={handleDeleteTask}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default TaskBoard;
