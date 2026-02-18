import { useState } from 'react';
import { PolicyRule, PolicyCondition, generateRuleId, generateConditionId, PolicyCategory, PolicyAction, PolicyConditionType } from '../../lib/policyTypes';

interface PolicyRuleBuilderProps {
  rule: PolicyRule | null;
  onSave: (rule: PolicyRule) => void;
  onCancel: () => void;
}

export function PolicyRuleBuilder({ rule, onSave, onCancel }: PolicyRuleBuilderProps) {
  const [name, setName] = useState(rule?.name || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [category, setCategory] = useState<PolicyCategory>(rule?.category || 'budget');
  const [action, setAction] = useState<PolicyAction>(rule?.action || 'require_approval');
  const [priority, setPriority] = useState(rule?.priority || 50);
  const [enabled, setEnabled] = useState(rule?.enabled ?? true);
  const [conditions, setConditions] = useState<PolicyCondition[]>(rule?.conditions || []);

  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      {
        id: generateConditionId(),
        type: 'cost',
        operator: 'greater_than',
        value: 0,
      },
    ]);
  };

  const handleRemoveCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const handleUpdateCondition = (id: string, updates: Partial<PolicyCondition>) => {
    setConditions(conditions.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Rule name is required');
      return;
    }

    const savedRule: PolicyRule = {
      id: rule?.id || generateRuleId(),
      name: name.trim(),
      description: description.trim(),
      category,
      action,
      priority,
      enabled,
      conditions,
    };

    onSave(savedRule);
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0A0F1E] border border-[rgba(255,255,255,0.1)] rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#F9FAFB]">
              {rule ? 'Edit Policy Rule' : 'Create New Rule'}
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Define conditions and actions for policy enforcement
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-160px)] space-y-4">
          {/* Rule Name */}
          <div>
            <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
              Rule Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Daily Budget Limit"
              className="w-full px-3 py-2 bg-[#141b2e] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#3B82F6] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what this rule does..."
              rows={2}
              className="w-full px-3 py-2 bg-[#141b2e] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#3B82F6] focus:outline-none resize-none"
            />
          </div>

          {/* Category & Action */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PolicyCategory)}
                className="w-full px-3 py-2 bg-[#141b2e] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#F9FAFB] focus:border-[#3B82F6] focus:outline-none"
              >
                <option value="budget">Budget</option>
                <option value="tools">Tools</option>
                <option value="data">Data</option>
                <option value="output">Output</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
                Action
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as PolicyAction)}
                className="w-full px-3 py-2 bg-[#141b2e] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#F9FAFB] focus:border-[#3B82F6] focus:outline-none"
              >
                <option value="allow">Allow</option>
                <option value="deny">Deny</option>
                <option value="require_approval">Require Approval</option>
              </select>
            </div>
          </div>

          {/* Priority & Enabled */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
                Priority (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#141b2e] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#F9FAFB] focus:border-[#3B82F6] focus:outline-none"
              />
              <p className="text-xs text-[#6B7280] mt-1">Higher priority rules evaluated first</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
                Status
              </label>
              <label className="flex items-center gap-3 h-10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#0A0F1E] rounded-full peer peer-checked:bg-[#3B82F6] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                <span className="text-sm text-[#D1D5DB]">{enabled ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>
          </div>

          {/* Conditions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-[#D1D5DB]">
                Conditions
              </label>
              <button
                onClick={handleAddCondition}
                className="px-3 py-1 bg-[#3B82F6] text-white rounded text-xs font-medium hover:bg-[#2563EB] transition-all"
              >
                + Add Condition
              </button>
            </div>

            {conditions.length === 0 ? (
              <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-4 text-center text-sm text-[#9CA3AF]">
                No conditions yet. Click "Add Condition" to start.
              </div>
            ) : (
              <div className="space-y-3">
                {conditions.map((condition, idx) => (
                  <ConditionBuilder
                    key={condition.id}
                    condition={condition}
                    index={idx}
                    onUpdate={(updates) => handleUpdateCondition(condition.id, updates)}
                    onRemove={() => handleRemoveCondition(condition.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-[#141b2e] border border-[rgba(255,255,255,0.1)] text-[#D1D5DB] rounded-lg text-sm font-medium hover:bg-[#1e2740] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB] transition-all"
          >
            {rule ? 'Update Rule' : 'Create Rule'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ConditionBuilderProps {
  condition: PolicyCondition;
  index: number;
  onUpdate: (updates: Partial<PolicyCondition>) => void;
  onRemove: () => void;
}

function ConditionBuilder({ condition, index, onUpdate, onRemove }: ConditionBuilderProps) {
  const operatorsByType: Record<PolicyConditionType, PolicyCondition['operator'][]> = {
    cost: ['greater_than', 'less_than', 'equals'],
    tool: ['equals', 'contains', 'matches'],
    model: ['equals', 'not_equals', 'contains'],
    time: ['equals'],
    agent: ['equals', 'not_equals'],
  };

  const availableOperators = operatorsByType[condition.type];

  return (
    <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-[#9CA3AF]">Condition {index + 1}</span>
        <button
          onClick={onRemove}
          className="ml-auto text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] rounded px-2 py-1 text-xs transition-all"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Type */}
        <div>
          <label className="block text-xs text-[#9CA3AF] mb-1">Type</label>
          <select
            value={condition.type}
            onChange={(e) => onUpdate({ type: e.target.value as PolicyConditionType })}
            className="w-full px-2 py-1.5 bg-[#0A0F1E] border border-[rgba(255,255,255,0.1)] rounded text-xs text-[#F9FAFB] focus:border-[#3B82F6] focus:outline-none"
          >
            <option value="cost">Cost</option>
            <option value="tool">Tool</option>
            <option value="model">Model</option>
            <option value="time">Time</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        {/* Operator */}
        <div>
          <label className="block text-xs text-[#9CA3AF] mb-1">Operator</label>
          <select
            value={condition.operator}
            onChange={(e) => onUpdate({ operator: e.target.value as PolicyCondition['operator'] })}
            className="w-full px-2 py-1.5 bg-[#0A0F1E] border border-[rgba(255,255,255,0.1)] rounded text-xs text-[#F9FAFB] focus:border-[#3B82F6] focus:outline-none"
          >
            {availableOperators.map((op) => (
              <option key={op} value={op}>
                {op.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Value */}
        <div>
          <label className="block text-xs text-[#9CA3AF] mb-1">Value</label>
          {condition.type === 'cost' ? (
            <input
              type="number"
              step="0.01"
              value={condition.value}
              onChange={(e) => onUpdate({ value: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-1.5 bg-[#0A0F1E] border border-[rgba(255,255,255,0.1)] rounded text-xs text-[#F9FAFB] focus:border-[#3B82F6] focus:outline-none"
            />
          ) : condition.type === 'time' ? (
            <select
              value={condition.value}
              onChange={(e) => onUpdate({ value: e.target.value })}
              className="w-full px-2 py-1.5 bg-[#0A0F1E] border border-[rgba(255,255,255,0.1)] rounded text-xs text-[#F9FAFB] focus:border-[#3B82F6] focus:outline-none"
            >
              <option value="business_hours">Business Hours</option>
              <option value="daily">Daily</option>
            </select>
          ) : (
            <input
              type="text"
              value={condition.value}
              onChange={(e) => onUpdate({ value: e.target.value })}
              placeholder="Enter value"
              className="w-full px-2 py-1.5 bg-[#0A0F1E] border border-[rgba(255,255,255,0.1)] rounded text-xs text-[#F9FAFB] focus:border-[#3B82F6] focus:outline-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}
