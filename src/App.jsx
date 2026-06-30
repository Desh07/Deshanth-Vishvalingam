import { Component } from 'react';
import Portfolio from './Portfolio';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(err) { return { error: err }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding:20,fontFamily: 'Inter, sans-serif', color: 'crimson'}}>
          <h2>Runtime error in Portfolio</h2>
          <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.error && this.state.error.stack || this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Portfolio />
    </ErrorBoundary>
  );
}

export default App;