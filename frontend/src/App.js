import { FeedbackProvider } from './hooks/FeedbackProvider';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';

function App() {
  return (
    <FeedbackProvider>
      <div className="vs-app-shell">
        <PipelineToolbar />
        <main className="vs-app-main">
          <PipelineUI />
        </main>
      </div>
    </FeedbackProvider>
  );
}

export default App;