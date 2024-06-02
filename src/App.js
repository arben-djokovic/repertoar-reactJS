import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from './pages/Login';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
