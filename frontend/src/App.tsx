import Dashboard from './layouts/Dashboard'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './auth/Signup';
import LandingPage from './components/LandingPage';
import Login from './auth/Login';
import UserDashboard from './layouts/user/UserDashboard';


const App = () => {
	return (
    <BrowserRouter>
      {/* 2. Routes defines the routing logic */}
      <Routes>
        {/* The HomePage should be the default route */}
        <Route path="/" element={<LandingPage />} />

        {/* Define paths for your other pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        {/* Example for your Booking Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/user" element={<UserDashboard />} />

        {/* Catch-all for 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
