/**
 * Cost Tracker Panel
 * Shows cost estimates and usage tips
 */

interface CostTier {
  model: string;
  inputCost: string;
  outputCost: string;
  use: string;
}

const COST_REFERENCE: CostTier[] = [
  { model: 'GPT-4o', inputCost: '$2.50/1M', outputCost: '$10/1M', use: 'Complex tasks' },
  { model: 'GPT-4o-mini', inputCost: '$0.15/1M', outputCost: '$0.60/1M', use: 'Fast tasks' },
  { model: 'Claude Sonnet 4', inputCost: '$3/1M', outputCost: '$15/1M', use: 'Long context' },
  { model: 'Gemini 2.0 Flash', inputCost: 'Free', outputCost: 'Free', use: 'Development' },
];

interface TipItem {
  tip: string;
  savings: string;
}

const COST_TIPS: TipItem[] = [
  { tip: 'Use GPT-4o-mini for simple tasks', savings: '~90% cheaper' },
  { tip: 'Enable caching for repeated content', savings: '~50% off cache hits' },
  { tip: 'Use Gemini Flash for development', savings: '100% free' },
  { tip: 'Batch similar requests together', savings: '~30% fewer calls' },
];

export function CostTracker() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Cost Reference</h3>
      
      {/* Model Costs */}
      <div className="space-y-2 mb-4">
        {COST_REFERENCE.map((tier) => (
          <div key={tier.model} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-900">{tier.model}</span>
              <span className="text-xs text-gray-500">{tier.use}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span>In: {tier.inputCost}</span>
              <span>•</span>
              <span>Out: {tier.outputCost}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Cost Saving Tips */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">💡 Cost Saving Tips</h4>
        <div className="space-y-2">
          {COST_TIPS.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-gray-700">{item.tip}</p>
                <p className="text-xs text-green-600 font-medium">{item.savings}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Calculator */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Quick Calculator</h4>
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <div className="space-y-1 text-gray-600">
            <div>1K tokens (GPT-4o): <span className="font-mono text-gray-900">$0.0025</span></div>
            <div>10K tokens (GPT-4o): <span className="font-mono text-gray-900">$0.025</span></div>
            <div>100K tokens (GPT-4o): <span className="font-mono text-gray-900">$0.25</span></div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Tip: ~750 words = 1K tokens
          </p>
        </div>
      </div>
    </div>
  );
}
