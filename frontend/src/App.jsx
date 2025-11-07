import './App.css'
import GraphBlockHolder from './components/graph_block_holder/GraphBlockHolder.jsx';

function App() {
  return (
    <div className="min-h-screen font-body bg-main-bg text-main-text text-base leading-5 p-8 flex flex-col">
      <GraphBlockHolder />
    </div>
  );
}

export default App;
