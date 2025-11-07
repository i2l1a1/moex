import './App.css'
import GraphBlockHolder from './components/graph_block_holder/GraphBlockHolder.jsx';

function App() {
  return (
    <div className="h-screen w-screen bg-main-bg text-main-text text-base leading-5 flex flex-col">
      <GraphBlockHolder />
    </div>
  );
}

export default App;
