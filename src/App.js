import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Admin from './pages/Admin';
import User from './pages/User';
import Home from './pages/Home';
import { AdminRoute } from './services/AdminRoute';
import { PrivateRoute } from './services/PrivateRoute';
import { GuestRoute } from './services/GuestRoute';
import AddSong from './pages/AddSong';


function App() {
  return (
    <div className="App">
      <header>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/admin">Admin</a></li>
          <li><a href="/user">User</a></li>
          <li><a href="/add-song">add song</a></li>
          <li><a href="/log-in">Log in</a></li>
          <li onClick={()=>{localStorage.clear()}}>Log out</li>
        </ul>
      </header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/log-in' element={<GuestRoute><Login /></GuestRoute>} />
        <Route path='/admin' element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path='/user' element={<PrivateRoute><User /></PrivateRoute>} />
        <Route path='/add-song' element={<AdminRoute><AddSong /></AdminRoute>} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
