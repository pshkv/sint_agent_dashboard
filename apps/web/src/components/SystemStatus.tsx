/**
 * System Status Panel
 * Shows Gateway health, connections, and system info
 */

import { useState, useEffect } from 'react';

interface StatusItem {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'error' | 'unknown';
  icon: string;
}

export function SystemStatus() {
  const [status, setStatus] = useState<StatusItem[]>([
    { label: 'Gateway', value: 'Checking...', status: 'unknown', icon: '🔌' },
    { label: 'Control UI', value: 'Embedded', status: 'good', icon: '✅' },
    { label: 'WebSocket', value: 'Via iframe', status: 'warning', icon: '⚡' },
    { label: 'Location', value: 'localhost:18789', status: 'good', icon: '🏠' },
  ]);

  useEffect(() => {
    // Check if Gateway is reachable
    fetch('http://127.0.0.1:18789/')
      .then((res) => {
        if (res.ok) {
          setStatus((prev) =>
            prev.map((item) =>
              item.label === 'Gateway'
                ? { ...item, value: 'Online', status: 'good' }
                : item
            )
          );
        } else {
          setStatus((prev) =>
            prev.map((item) =>
              item.label === 'Gateway'
                ? { ...item, value: 'Error', status: 'error' }
                : item
            )
          );
        }
      })
      .catch(() => {
        setStatus((prev) =>
          prev.map((item) =>
            item.label === 'Gateway'
              ? { ...item, value: 'Offline', status: 'error' }
              : item
          )
        );
      });
  }, []);

  const getStatusColor = (status: StatusItem['status']) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: StatusItem['status']) => {
    switch (status) {
      case 'good':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">System Status</h3>
      
      <div className="space-y-2">
        {status.map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(item.status)}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm opacity-75">{item.value}</div>
              </div>
            </div>
            <span className="text-2xl">{getStatusIcon(item.status)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Protocol</span>
          <span className="font-mono text-gray-900">v3</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Mode</span>
          <span className="font-mono text-gray-900">hybrid</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Dashboard</span>
          <span className="font-mono text-gray-900">v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
