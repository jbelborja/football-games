import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0e17] text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Algo salió mal</h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Se ha producido un error inesperado al renderizar los datos. Puedes restablecer la aplicación y limpiar la caché para continuar.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Reintentar
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-rose-600/30"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar caché y recargar</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
