import { useState } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, XMarkIcon, UserIcon, CalendarIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const TaskItem = ({ task, projectId, onDelete }) => {
  const user = useCurrentUser();
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.3)' : 'none',
  };

  const handleDelete = async () => {
    if (!window.confirm('Deseja realmente excluir esta tarefa?')) return;
    if (!user || !projectId) return;
    try {
      await deleteDoc(doc(db, 'projects', projectId, 'tasks', task.id));
      if (onDelete) onDelete(task.id, task.status);
    } catch {
      alert('Erro ao excluir tarefa');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div 
      ref={setNodeRef}
      className="bg-gray-700 border border-gray-600 p-4 mb-3 relative cursor-grab select-none hover:border-gray-500 transition-colors"
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="mb-3">
        <h4 className="font-semibold text-white text-sm mb-2">{task.title}</h4>
        {task.description && (
          <div>
            <p className={`text-gray-300 text-xs ${!showFullDescription ? 'overflow-hidden text-ellipsis whitespace-nowrap' : ''}`}>
              {task.description}
            </p>
            {task.description.length > 50 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="flex items-center gap-1 text-teal-400 hover:text-teal-300 text-xs mt-1 transition-colors"
              >
                {showFullDescription ? (
                  <>
                    <ChevronUpIcon className="h-3 w-3" />
                    Mostrar menos
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="h-3 w-3" />
                    Mostrar mais
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <UserIcon className="h-3 w-3 text-teal-400" />
          <span className="text-gray-300 text-xs">{task.assignee}</span>
        </div>
        
        {(task.startDate || task.dueDate) && (
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-3 w-3 text-teal-400" />
            <span className="text-gray-300 text-xs">
              {task.startDate && formatDate(task.startDate)}
              {task.startDate && task.dueDate && ' - '}
              {task.dueDate && formatDate(task.dueDate)}
            </span>
          </div>
        )}
      </div>
      
      <div className="absolute top-2 right-2 flex gap-1">
        <Link 
          to={`/projects/${projectId}/tasks/${task.id}/edit`} 
          className="text-teal-400 hover:text-teal-300 transition-colors p-1" 
          title="Editar"
        >
          <PencilIcon className="h-3 w-3" />
        </Link>
        <button 
          onClick={handleDelete} 
          className="text-red-400 hover:text-red-300 transition-colors p-1" 
          title="Excluir"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
