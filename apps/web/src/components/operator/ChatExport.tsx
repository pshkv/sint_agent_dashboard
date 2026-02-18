import React, { useState } from 'react';
import { Download, FileText, FileJson, File, Check } from 'lucide-react';

export interface ExportOptions {
  format: 'json' | 'markdown' | 'txt';
  includeTimestamps: boolean;
  includeToolCalls: boolean;
  includeSystemMessages: boolean;
  dateRange: 'all' | 'current' | 'custom';
  customStart?: number;
  customEnd?: number;
}

interface ChatExportProps {
  onExport: (options: ExportOptions) => void;
  messageCount: number;
}

export const ChatExport: React.FC<ChatExportProps> = ({ onExport, messageCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'markdown',
    includeTimestamps: true,
    includeToolCalls: true,
    includeSystemMessages: false,
    dateRange: 'all',
  });
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    await onExport(options);
    setExporting(false);
    setExported(true);
    setTimeout(() => {
      setExported(false);
      setIsOpen(false);
    }, 2000);
  };

  const formats = [
    { id: 'markdown', label: 'Markdown', icon: FileText, ext: '.md' },
    { id: 'json', label: 'JSON', icon: FileJson, ext: '.json' },
    { id: 'txt', label: 'Plain Text', icon: File, ext: '.txt' },
  ] as const;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Export Modal */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-200">Export Chat</h3>
              <span className="text-xs text-gray-500">{messageCount} messages</span>
            </div>

            {/* Format Selection */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {formats.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setOptions(prev => ({ ...prev, format: id }))}
                    className={`p-2 rounded border transition-all ${
                      options.format === id
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-gray-700 bg-gray-700/30 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs font-medium">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 block mb-2">
                Include
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeTimestamps}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    includeTimestamps: e.target.checked 
                  }))}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-300">Timestamps</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeToolCalls}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    includeToolCalls: e.target.checked 
                  }))}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-300">Tool Calls</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeSystemMessages}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    includeSystemMessages: e.target.checked 
                  }))}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-300">System Messages</span>
              </label>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">
                Date Range
              </label>
              <div className="flex gap-2">
                {(['all', 'current'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setOptions(prev => ({ ...prev, dateRange: range }))}
                    className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-all capitalize ${
                      options.dateRange === range
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {range === 'current' ? 'Current Session' : 'All Time'}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={exporting || exported}
              className={`w-full py-2 rounded font-medium transition-all flex items-center justify-center gap-2 ${
                exported
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } ${exporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {exporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : exported ? (
                <>
                  <Check className="w-4 h-4" />
                  Exported!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export {options.format.toUpperCase()}
                </>
              )}
            </button>

            {/* Preview Info */}
            <div className="pt-2 border-t border-gray-700 text-xs text-gray-500">
              File will be saved as:{' '}
              <span className="text-gray-400 font-mono">
                chat-export-{new Date().toISOString().split('T')[0]}
                {formats.find(f => f.id === options.format)?.ext}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Export utility functions
export const exportToMarkdown = (
  messages: any[],
  options: ExportOptions
): string => {
  let content = '# Chat Export\n\n';
  
  if (options.includeTimestamps) {
    content += `Exported: ${new Date().toLocaleString()}\n`;
    content += `Total Messages: ${messages.length}\n\n`;
    content += '---\n\n';
  }

  messages.forEach((msg) => {
    if (!options.includeSystemMessages && msg.role === 'system') return;

    if (options.includeTimestamps && msg.timestamp) {
      content += `**[${new Date(msg.timestamp).toLocaleString()}]**\n\n`;
    }

    content += `### ${msg.role === 'user' ? '👤 User' : '🤖 Assistant'}\n\n`;
    content += `${msg.content}\n\n`;

    if (options.includeToolCalls && msg.toolCalls && msg.toolCalls.length > 0) {
      content += '**Tool Calls:**\n\n';
      msg.toolCalls.forEach((tool: any) => {
        content += `- \`${tool.name}\`${tool.status ? ` (${tool.status})` : ''}\n`;
      });
      content += '\n';
    }

    content += '---\n\n';
  });

  return content;
};

export const exportToJSON = (
  messages: any[],
  options: ExportOptions
): string => {
  const filtered = messages.filter(msg => 
    options.includeSystemMessages || msg.role !== 'system'
  );

  const data = {
    exportDate: new Date().toISOString(),
    messageCount: filtered.length,
    options,
    messages: filtered.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: options.includeTimestamps ? msg.timestamp : undefined,
      toolCalls: options.includeToolCalls ? msg.toolCalls : undefined,
    })),
  };

  return JSON.stringify(data, null, 2);
};

export const exportToText = (
  messages: any[],
  options: ExportOptions
): string => {
  let content = 'CHAT EXPORT\n';
  content += '='.repeat(50) + '\n\n';
  
  if (options.includeTimestamps) {
    content += `Exported: ${new Date().toLocaleString()}\n`;
    content += `Total Messages: ${messages.length}\n\n`;
  }

  messages.forEach((msg, idx) => {
    if (!options.includeSystemMessages && msg.role === 'system') return;

    if (options.includeTimestamps && msg.timestamp) {
      content += `[${new Date(msg.timestamp).toLocaleString()}]\n`;
    }

    content += `${msg.role.toUpperCase()}: ${msg.content}\n`;

    if (options.includeToolCalls && msg.toolCalls && msg.toolCalls.length > 0) {
      content += '\nTool Calls:\n';
      msg.toolCalls.forEach((tool: any) => {
        content += `  - ${tool.name}${tool.status ? ` (${tool.status})` : ''}\n`;
      });
    }

    if (idx < messages.length - 1) {
      content += '\n' + '-'.repeat(50) + '\n\n';
    }
  });

  return content;
};
