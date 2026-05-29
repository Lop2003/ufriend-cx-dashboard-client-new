import React from 'react';
import { toast } from 'sonner';

type SeverityType = 'success' | 'error' | 'warning' | 'info';

/**
 * Backward-compatible function: call from anywhere (services, legacy hooks) to show a notification.
 * Uses Sonner internally for beautiful animations.
 */
export function showToast(severity: SeverityType, message: string) {
  if (severity === 'success') {
    toast.success(message);
  } else if (severity === 'error') {
    toast.error(message);
  } else if (severity === 'warning' || severity === 'info') {
    toast.warning(message);
  } else {
    toast(message);
  }
}

/**
 * Hook for modern React components/hooks to use Toast.
 */
export function useToast() {
  return {
    showToast: (severity: SeverityType, message: string) => showToast(severity, message),
  };
}

/**
 * Empty wrapper provider for backward compatibility.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * Dummy container wrapper for backward compatibility.
 */
export function ToastContainer() {
  return null;
}

export default ToastContainer;
