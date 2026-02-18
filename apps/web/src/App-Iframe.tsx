/**
 * SINT Dashboard - Iframe Approach
 * Embeds OpenClaw's official Control UI which already works
 */

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">SINT Agent Dashboard</h1>
            <p className="text-xs text-gray-500">Powered by OpenClaw Control UI</p>
          </div>
          <a 
            href="http://127.0.0.1:18789/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Open in new tab →
          </a>
        </div>
      </header>

      {/* OpenClaw Control UI iframe */}
      <iframe
        src="http://127.0.0.1:18789/"
        className="flex-1 w-full border-0"
        title="OpenClaw Control UI"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </div>
  );
}
