import { useDraggable } from '@dnd-kit/core';
import type { Task } from '@sint-dashboard/shared';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const PRIORITY_COLORS = {
  P0: 'bg-red-500',
  P1: 'bg-amber-500',
  P2: 'bg-blue-500',
  P3: 'bg-gray-500',
};

const STATUS_ICONS = {
  backlog: '📋',
  in_progress: '▶️',
  review: '👀',
  done: '✅',
  paused: '⏸️',
  failed: '❌',
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={clsx(
        'card cursor-pointer select-none',
        isDragging && 'opacity-50'
      )}
    >
      <div className="space-y-2">
        {/* Priority badge and title */}
        <div className="flex items-start gap-2">
          <span className={clsx(
            'text-[10px] font-semibold px-2 py-0.5 rounded text-white flex-shrink-0',
            PRIORITY_COLORS[task.priority]
          )}>
            {task.priority}
          </span>
          <h4 className="text-sm font-medium flex-1 line-clamp-2">{task.title}</h4>
        </div>

        {/* Agent and time */}
        <div className="flex items-center gap-3 text-xs text-notion-text-secondary">
          <span className="flex items-center gap-1">
            <span>👤</span>
            <span>{task.assigned_agent}</span>
          </span>
          
          {task.estimated_hours && (
            <span className="flex items-center gap-1">
              <span>⏱️</span>
              <span>
                {task.actual_hours?.toFixed(1) || 0}h / {task.estimated_hours}h
              </span>
            </span>
          )}
        </div>

        {/* Tags and status */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {task.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-[10px] bg-notion-surface px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="text-[10px] text-notion-text-secondary">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
          
          <span className="text-base">{STATUS_ICONS[task.status]}</span>
        </div>
      </div>
    </div>
  );
}
