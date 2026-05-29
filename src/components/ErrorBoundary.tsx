import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  private handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-slate-100 font-sans selection:bg-rose-500/30 selection:text-rose-200">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/20 via-slate-950 to-slate-950 pointer-events-none" />
          
          <div className="relative max-w-lg w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl text-center overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-violet-500 to-rose-500" />
            
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-6 animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              เกิดข้อผิดพลาดในการโหลดระบบ
            </h1>
            <p className="text-sm text-slate-400 mb-6">
              ระบบส่วนหน้าขัดข้องกะทันหัน ซึ่งอาจเกิดจากข้อมูลไม่สอดคล้องหรือปัญหาการเชื่อมต่อ
            </p>

            {this.state.error && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6 text-left max-h-48 overflow-y-auto font-mono text-xs text-rose-300 scrollbar-thin scrollbar-thumb-slate-800">
                <p className="font-bold text-rose-400 mb-1">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="opacity-70 whitespace-pre-wrap leading-relaxed mt-2 text-[10px]">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:scale-[0.98] text-white font-medium text-sm rounded-xl shadow-lg shadow-rose-900/20 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                ลองใหม่อีกครั้ง
              </button>
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-200 font-medium text-sm rounded-xl border border-slate-700 transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
