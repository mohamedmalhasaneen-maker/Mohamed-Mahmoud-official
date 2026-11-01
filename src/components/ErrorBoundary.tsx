import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare state: ErrorBoundaryState;
  declare props: Readonly<ErrorBoundaryProps>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('UI recovery boundary caught error:', error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#060b18] text-slate-900 dark:text-slate-100 text-center">
          <div className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl">
            <h2 className="text-xl font-extrabold mb-2">تعذر تحميل أحد أجزاء الصفحة</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
              قد يكون السبب ضعفاً مؤقتاً في اتصال الإنترنت. يرجى إعادة المحاولة للمتابعة.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="min-h-[46px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 text-white text-sm font-bold cursor-pointer"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
