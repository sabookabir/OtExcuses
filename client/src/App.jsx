import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Support from './pages/Support';
import History from './pages/History';

function App() {
  const { session, checkUser, loading } = useStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-glitch text-2xl font-black text-toxic-500 neon-text-toxic">
          OVERTHINKING...
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/auth" 
          element={!session ? <Auth /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={session ? <Home /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/support" 
          element={session ? <Support /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/history" 
          element={session ? <History /> : <Navigate to="/auth" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
