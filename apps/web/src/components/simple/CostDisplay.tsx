interface CostDisplayProps {
  cost: number;
}

export function CostDisplay({ cost }: CostDisplayProps) {
  return (
    <div className="bg-gray-100 rounded-lg px-4 py-2">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-xs text-gray-500">Total Cost</p>
          <p className="text-lg font-semibold text-gray-900">
            ${cost.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
