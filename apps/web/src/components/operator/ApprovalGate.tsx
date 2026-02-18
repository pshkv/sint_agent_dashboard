import { useState, useEffect } from 'react';

interface ApprovalGateProps {
  action: string;
  description: string;
  tool: string;
  input: any;
  policyRule?: string;
  timeoutSeconds?: number;
  onApprove: () => void;
  onReject: () => void;
  onEdit: (editedInput: any) => void;
}

export function ApprovalGate({
  action,
  description,
  tool,
  input,
  policyRule,
  timeoutSeconds = 60,
  onApprove,
  onReject,
  onEdit,
}: ApprovalGateProps) {
  const [timeLeft, setTimeLeft] = useState(timeoutSeconds);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInput, setEditedInput] = useState(JSON.stringify(input, null, 2));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onReject(); // Auto-reject on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onReject]);

  const handleEditApprove = () => {
    try {
      const parsed = JSON.parse(editedInput);
      onEdit(parsed);
    } catch (e) {
      alert('Invalid JSON format');
    }
  };

  return (
    <div className="my-4 bg-[rgba(245,158,11,0.1)] border border-[#F59E0B] rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="font-semibold text-[#F9FAFB] mb-1">
              Approval Required: {action}
            </div>
            <div className="text-sm text-[#D1D5DB]">{description}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#F59E0B] font-mono">
            ⏱ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Tool & Policy Info */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <span className="text-[#9CA3AF]">
          Tool: <span className="text-[#D1D5DB] font-mono">{tool}</span>
        </span>
        {policyRule && (
          <span className="text-[#9CA3AF]">
            Policy: <span className="text-[#D1D5DB]">{policyRule}</span>
          </span>
        )}
      </div>

      {/* Input Display */}
      {!isEditing ? (
        <div className="mb-3">
          <div className="text-xs text-[#9CA3AF] mb-1">Input:</div>
          <pre className="bg-[#1e2740] p-3 rounded text-xs text-[#D1D5DB] overflow-x-auto max-h-32">
            {JSON.stringify(input, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="mb-3">
          <div className="text-xs text-[#9CA3AF] mb-1">Edit Input:</div>
          <textarea
            value={editedInput}
            onChange={(e) => setEditedInput(e.target.value)}
            className="w-full bg-[#1e2740] border border-[rgba(255,255,255,0.1)] p-3 rounded text-xs text-[#D1D5DB] font-mono resize-none focus:border-[#3B82F6] focus:outline-none"
            rows={8}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {!isEditing ? (
          <>
            <button
              onClick={onApprove}
              className="flex-1 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-medium transition-all"
            >
              ✅ Approve
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg font-medium transition-all"
            >
              ✏️ Edit & Approve
            </button>
            <button
              onClick={onReject}
              className="flex-1 px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-medium transition-all"
            >
              ❌ Reject
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEditApprove}
              className="flex-1 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-medium transition-all"
            >
              ✅ Approve Edited
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-[#1e2740] border border-[rgba(255,255,255,0.1)] text-[#D1D5DB] rounded-lg font-medium hover:bg-[#141b2e] transition-all"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
