import { useState } from 'react';
import { PolicyRule, PolicyTemplate, policyTemplates, generateRuleId, generateConditionId } from '../../lib/policyTypes';
import { PolicyTemplateLibrary } from './PolicyTemplateLibrary';
import { PolicyRuleBuilder } from './PolicyRuleBuilder';

interface PolicyEditorProps {
  rules: PolicyRule[];
  onRulesChange: (rules: PolicyRule[]) => void;
}

export function PolicyEditor({ rules, onRulesChange }: PolicyEditorProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingRule, setEditingRule] = useState<PolicyRule | null>(null);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);

  const handleAddTemplate = (template: PolicyTemplate) => {
    const newRules = template.rules.map(rule => ({
      ...rule,
      id: generateRuleId(),
      conditions: rule.conditions.map(c => ({ ...c, id: generateConditionId() })),
    }));
    onRulesChange([...rules, ...newRules]);
    setShowTemplates(false);
  };

  const handleToggleRule = (ruleId: string) => {
    onRulesChange(
      rules.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    onRulesChange(rules.filter(rule => rule.id !== ruleId));
  };

  const handleEditRule = (rule: PolicyRule) => {
    setEditingRule(rule);
    setShowRuleBuilder(true);
  };

  const handleSaveRule = (rule: PolicyRule) => {
    if (editingRule) {
      // Update existing
      onRulesChange(
        rules.map(r => (r.id === rule.id ? rule : r))
      );
    } else {
      // Add new
      onRulesChange([...rules, rule]);
    }
    setShowRuleBuilder(false);
    setEditingRule(null);
  };

  const handleCreateNew = () => {
    setEditingRule(null);
    setShowRuleBuilder(true);
  };

  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

  const getCategoryColor = (category: PolicyRule['category']) => {
    switch (category) {
      case 'budget': return 'text-[#10B981] bg-[rgba(16,185,129,0.1)]';
      case 'tools': return 'text-[#3B82F6] bg-[rgba(59,130,246,0.1)]';
      case 'data': return 'text-[#F59E0B] bg-[rgba(245,158,11,0.1)]';
      case 'output': return 'text-[#8B5CF6] bg-[rgba(139,92,246,0.1)]';
    }
  };

  const getActionColor = (action: PolicyRule['action']) => {
    switch (action) {
      case 'allow': return 'text-[#10B981]';
      case 'deny': return 'text-[#EF4444]';
      case 'require_approval': return 'text-[#F59E0B]';
    }
  };

  const getActionIcon = (action: PolicyRule['action']) => {
    switch (action) {
      case 'allow': return '✓';
      case 'deny': return '✕';
      case 'require_approval': return '⚠';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {showTemplates && (
        <PolicyTemplateLibrary
          templates={policyTemplates}
          onSelect={handleAddTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {showRuleBuilder && (
        <PolicyRuleBuilder
          rule={editingRule}
          onSave={handleSaveRule}
          onCancel={() => {
            setShowRuleBuilder(false);
            setEditingRule(null);
          }}
        />
      )}

      {!showTemplates && !showRuleBuilder && (
        <>
          {/* Header */}
          <div className="p-4 border-b border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-[#F9FAFB]">Policy Editor</h3>
                <p className="text-xs text-[#9CA3AF] mt-1">{rules.length} rules configured</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTemplates(true)}
                  className="px-3 py-1.5 bg-[#1e2740] border border-[rgba(255,255,255,0.1)] text-[#D1D5DB] rounded-lg text-xs hover:bg-[#141b2e] transition-all"
                >
                  📚 Templates
                </button>
                <button
                  onClick={handleCreateNew}
                  className="px-3 py-1.5 bg-[#3B82F6] text-white rounded-lg text-xs font-medium hover:bg-[#2563EB] transition-all"
                >
                  + New Rule
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#141b2e] rounded-lg p-2">
                <div className="text-xs text-[#9CA3AF]">Enabled</div>
                <div className="text-sm font-semibold text-[#10B981]">
                  {rules.filter(r => r.enabled).length}
                </div>
              </div>
              <div className="bg-[#141b2e] rounded-lg p-2">
                <div className="text-xs text-[#9CA3AF]">Disabled</div>
                <div className="text-sm font-semibold text-[#6B7280]">
                  {rules.filter(r => !r.enabled).length}
                </div>
              </div>
              <div className="bg-[#141b2e] rounded-lg p-2">
                <div className="text-xs text-[#9CA3AF]">Violations</div>
                <div className="text-sm font-semibold text-[#EF4444]">0</div>
              </div>
            </div>
          </div>

          {/* Rules List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sortedRules.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-4xl mb-3">🛡️</div>
                <p className="text-[#9CA3AF] text-sm mb-4">No policies configured yet</p>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB] transition-all"
                >
                  Browse Templates
                </button>
              </div>
            ) : (
              sortedRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`bg-[#141b2e] border rounded-lg p-4 transition-all ${
                    rule.enabled
                      ? 'border-[rgba(255,255,255,0.1)]'
                      : 'border-[rgba(255,255,255,0.05)] opacity-50'
                  }`}
                >
                  {/* Rule Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-[#F9FAFB]">{rule.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(rule.category)}`}>
                          {rule.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#9CA3AF]">{rule.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-3">
                      {/* Priority Badge */}
                      <span className="px-2 py-1 bg-[#0A0F1E] rounded text-xs text-[#9CA3AF]">
                        P{rule.priority}
                      </span>
                      
                      {/* Enabled Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={() => handleToggleRule(rule.id)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-[#0A0F1E] rounded-full peer peer-checked:bg-[#3B82F6] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                      </label>
                    </div>
                  </div>

                  {/* Rule Action & Conditions */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#9CA3AF]">Action:</span>
                      <span className={`font-semibold ${getActionColor(rule.action)}`}>
                        {getActionIcon(rule.action)} {rule.action.replace('_', ' ')}
                      </span>
                    </div>
                    
                    {rule.conditions.length > 0 && (
                      <div className="text-xs">
                        <span className="text-[#9CA3AF]">Conditions:</span>
                        <div className="mt-1 space-y-1">
                          {rule.conditions.map((condition) => (
                            <div key={condition.id} className="flex items-center gap-2 text-[#D1D5DB]">
                              <span className="text-[#6B7280]">•</span>
                              <span>{condition.type}</span>
                              <span className="text-[#6B7280]">{condition.operator}</span>
                              <span className="font-mono">{String(condition.value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rule Actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                    <button
                      onClick={() => handleEditRule(rule)}
                      className="px-3 py-1 text-xs text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)] rounded transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="px-3 py-1 text-xs text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] rounded transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
