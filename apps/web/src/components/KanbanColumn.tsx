import { useDroppable } from '@dnd-kit/core';
import type { Task, TaskStatus } from '@sint-dashboard/shared';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function KanbanColumn({ id, title, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm">{title}</h3>
        <span className="text-xs text-notion-text-secondary bg-notion-surface px-2 py-1 rounded">
          {tasks.length}
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className={`
          flex-1 space-y-3 p-2 rounded-lg border-2 border-dashed transition-colors
          ${isOver ? 'border-notion-accent bg-blue-50' : 'border-transparent'}
        `}
      >
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center text-notion-text-secondary text-sm py-8">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
