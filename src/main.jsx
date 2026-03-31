import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.error) {
      const message = this.state.error?.message ? String(this.state.error.message) : String(this.state.error)
      const stack = this.state.error?.stack ? String(this.state.error.stack) : ''
      const componentStack = this.state.errorInfo?.componentStack ? String(this.state.errorInfo.componentStack) : ''

      return (
        <div className="min-h-dvh bg-white p-6">
          <div className="mx-auto max-w-[900px] space-y-4">
            <div className="text-sm font-semibold text-slate-500">annotate crashed</div>
            <div className="text-2xl font-bold text-slate-900">Something went wrong.</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
              <div className="font-semibold">Error</div>
              <div className="mt-1 whitespace-pre-wrap break-words">{message}</div>
            </div>

            {(stack || componentStack) && (
              <details className="rounded-2xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                  Stack trace
                </summary>
                <pre className="mt-3 overflow-auto whitespace-pre-wrap break-words text-xs text-slate-700">
                  {stack}
                  {componentStack ? `\n\nComponent stack:\n${componentStack}` : ''}
                </pre>
              </details>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Reload
              </button>
              <button
                type="button"
                onClick={() => this.setState({ error: null, errorInfo: null })}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Try to recover
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
