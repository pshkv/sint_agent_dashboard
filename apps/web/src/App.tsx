import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from './lib/api';
import { useWebSocket } from './hooks/useWebSocket';
import { useTaskStore } from './stores/taskStore';
import { Kanban } from './components/Kanban';
import { TaskModal } from './components/TaskModal';
import { CostPanel } from './components/CostPanel';
import { Login } from './components/Login';
import type { Task, TaskStatus, WSEvent } from '@sint-dashboard/shared';

const queryClient = new QueryClient();

function Dashboard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCostPanel, setShowCostPanel] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const qc = useQueryClient();
  
  const { tasks, setTasks, addTask, updateTask: updateTaskInStore } = useTaskStore();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Verify token is valid
      api.auth.me()
        .then(() => {
          setIsAuthenticated(true);
          setCheckingAuth(false);
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
          setCheckingAuth(false);
        });
    } else {
      setIsAuthenticated(false);
      setCheckingAuth(false);
    }
  }, []);

  // Fetch tasks
  const { isLoading, data: tasksData } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.tasks.list(),
    enabled: isAuthenticated,
  });

  // Update tasks when data changes
  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData);
    }
  }, [tasksData, setTasks]);

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: api.tasks.create,
    onSuccess: (task) => {
      addTask(task);
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.tasks.update(id, data),
    onSuccess: (task) => {
      updateTaskInStore(task);
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: api.tasks.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const moveTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => api.tasks.move(id, status),
    onSuccess: (task) => {
      updateTaskInStore(task);
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // WebSocket real-time updates
  const handleWSMessage = useCallback((event: WSEvent) => {
    switch (event.type) {
      case 'task_created':
        addTask(event.data);
        break;
      case 'task_updated':
      case 'task_moved':
        updateTaskInStore(event.data);
        break;
      case 'cost_recorded':
        qc.invalidateQueries({ queryKey: ['analytics'] });
        break;
    }
  }, [addTask, updateTaskInStore, qc]);

  useWebSocket(handleWSMessage);

  // Quick add task
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddTitle, setQuickAddTitle] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAddTitle.trim()) {
      createTaskMutation.mutate({ title: quickAddTitle });
      setQuickAddTitle('');
      setShowQuickAdd(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setTasks([]);
  };

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onSuccess={() => setIsAuthenticated(true)} />;
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-notion-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">SINT Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCostPanel(!showCostPanel)}
            className="btn-secondary"
          >
            {showCostPanel ? '📊 Hide Analytics' : '📊 Show Analytics'}
          </button>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6" style={{ marginRight: showCostPanel ? '320px' : '0' }}>
        <Kanban
          tasks={tasks}
          onTaskMove={(id, status) => moveTaskMutation.mutate({ id, status })}
          onTaskClick={setSelectedTask}
        />
      </main>

      {/* Task modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(id, data) => updateTaskMutation.mutate({ id, data })}
          onDelete={(id) => {
            deleteTaskMutation.mutate(id);
            setSelectedTask(null);
          }}
        />
      )}

      {/* Cost panel */}
      {showCostPanel && <CostPanel />}

      {/* Quick add button */}
      <button
        onClick={() => setShowQuickAdd(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-notion-accent text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-2xl"
        style={{ marginRight: showCostPanel ? '320px' : '0' }}
      >
        +
      </button>

      {/* Quick add modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowQuickAdd(false)}>
          <div className="bg-white dark:bg-[#2c2c2c] rounded-lg shadow-xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Quick Add Task</h2>
            <form onSubmit={handleQuickAdd}>
              <input
                type="text"
                value={quickAddTitle}
                onChange={e => setQuickAddTitle(e.target.value)}
                placeholder="Task title..."
                className="w-full px-3 py-2 border border-notion-border rounded-md mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowQuickAdd(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
