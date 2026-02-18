import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OperatorView } from './components/operator/OperatorView';
import './styles/operator-theme.css';

const queryClient = new QueryClient();

export default function AppOperator() {
  return (
    <QueryClientProvider client={queryClient}>
      <OperatorView />
    </QueryClientProvider>
  );
}
