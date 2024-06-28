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
import AddSong from './pages/AddSong/AddSong';
import Header from './components/Header/Header';
import "./App.scss"
import Singup from './pages/Singup/Singup';
import Playlists from './pages/Playlists/Playlists';
import MyPlaylists from './pages/MyPlaylists/MyPlaylists';
import CreatePlaylist from './pages/CreatePlaylist/CreatePlaylist';
import Playlist from './pages/Playlist/Playlist';


function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/playlists' element={<Playlists />} />
        <Route path='/playlists/:id' element={<Playlist />} />
        <Route path='/my-playlists' element={<PrivateRoute><MyPlaylists /></PrivateRoute>} />
        <Route path='/create-playlist' element={<PrivateRoute><CreatePlaylist /></PrivateRoute>} />
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
