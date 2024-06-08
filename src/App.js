import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login/Login';
import Admin from './pages/Admin';
import User from './pages/User';
import Home from './pages/Home/Home';
import { AdminRoute } from './services/AdminRoute';
import { PrivateRoute } from './services/PrivateRoute';
import { GuestRoute } from './services/GuestRoute';
import AddSong from './pages/AddSong';
import Header from './components/Header';
import "./App.scss"
import Singup from './pages/Singup/Singup';


function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/log-in' element={<GuestRoute><Login /></GuestRoute>} />
        <Route path='/sing-up' element={<GuestRoute><Singup /></GuestRoute>} />
        <Route path='/admin' element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path='/me' element={<PrivateRoute><User /></PrivateRoute>} />
        <Route path='/add-song' element={<AdminRoute><AddSong /></AdminRoute>} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
