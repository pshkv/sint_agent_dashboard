import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { OperatorView } from './components/operator/OperatorView';
import './styles/operator-theme.css';

const queryClient = new QueryClient();

export default function AppRouter() {
  // Check URL parameter to determine view
  const urlParams = new URLSearchParams(window.location.search);
  const initialView = urlParams.get('view') === 'kanban' ? 'kanban' : 'operator';
  
  const [viewMode, setViewMode] = useState<'kanban' | 'operator'>(initialView);

  const toggleView = () => {
    const newView = viewMode === 'kanban' ? 'operator' : 'kanban';
    setViewMode(newView);
    // Update URL without reload
    window.history.pushState({}, '', `?view=${newView}`);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative">
        {/* View Toggle Button - Hidden on mobile */}
        <button
          onClick={toggleView}
          className="hidden md:block fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] px-3 py-1.5 bg-[#3B82F6]/90 hover:bg-[#2563EB] text-white rounded-lg shadow-lg text-xs font-medium transition-all backdrop-blur-sm"
        >
          {viewMode === 'kanban' ? 'Operator' : 'Kanban'} 🔄
        </button>

        {/* Render appropriate view */}
        {viewMode === 'operator' ? <OperatorView /> : <App />}
      </div>
    </QueryClientProvider>
  );
}
