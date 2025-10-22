import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TracksManager from './pages/TracksManager';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav style={{
          background: '#222',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <Link to="/" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>
            Tracks
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<TracksManager />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;