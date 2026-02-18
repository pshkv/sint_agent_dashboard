import { PolicyTemplate } from '../../lib/policyTypes';

interface PolicyTemplateLibraryProps {
  templates: PolicyTemplate[];
  onSelect: (template: PolicyTemplate) => void;
  onClose: () => void;
}

export function PolicyTemplateLibrary({ templates, onSelect, onClose }: PolicyTemplateLibraryProps) {
  const recommended = templates.filter(t => t.recommended);
  const others = templates.filter(t => !t.recommended);

  const getCategoryColor = (category: PolicyTemplate['category']) => {
    switch (category) {
      case 'budget': return 'text-[#10B981] bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)]';
      case 'tools': return 'text-[#3B82F6] bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.2)]';
      case 'data': return 'text-[#F59E0B] bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.2)]';
      case 'output': return 'text-[#8B5CF6] bg-[rgba(139,92,246,0.1)] border-[rgba(139,92,246,0.2)]';
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0A0F1E] border border-[rgba(255,255,255,0.1)] rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#F9FAFB]">Policy Templates</h3>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Choose a pre-built policy template to get started quickly
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {/* Recommended Templates */}
          {recommended.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#F9FAFB] mb-3 flex items-center gap-2">
                <span>⭐</span>
                Recommended Templates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommended.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={onSelect}
                    getCategoryColor={getCategoryColor}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Templates */}
          {others.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[#F9FAFB] mb-3">
                Other Templates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {others.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={onSelect}
                    getCategoryColor={getCategoryColor}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: PolicyTemplate;
  onSelect: (template: PolicyTemplate) => void;
  getCategoryColor: (category: PolicyTemplate['category']) => string;
}

function TemplateCard({ template, onSelect, getCategoryColor }: TemplateCardProps) {
  return (
    <button
      onClick={() => onSelect(template)}
      className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-4 text-left hover:border-[rgba(255,255,255,0.15)] hover:bg-[#1e2740] transition-all group"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{template.icon}</span>
        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-semibold text-[#F9FAFB] mb-1 group-hover:text-[#3B82F6] transition-colors">
            {template.name}
          </h5>
          <p className="text-xs text-[#9CA3AF]">{template.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(template.category)}`}>
          {template.category}
        </span>
        <span className="text-xs text-[#6B7280]">
          {template.rules.length} rule{template.rules.length !== 1 ? 's' : ''}
        </span>
      </div>
    </button>
  );
}
