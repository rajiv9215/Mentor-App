import Header from "./components/Header";
import Home from "./pages/homepage/Home";
import Footer from "./components/Footer";
import Login from "./pages/auth/Login";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Pricing from "./pages/pricing/Pricing";
import About from "./pages/about-us/About";
import Blog from "./pages/blogs/Blog";
import AiMentorMatch from "./pages/findMentor/AiMentorMatch";
import ContactPage from "./pages/contact/Contact";
import MentorDetail from "./pages/mentor/MentorDetail";
import BecomeMentor from "./pages/becomeMentor/BecomeMentor";
import AdminDashboard from "./pages/admin/AdminDashboard";
import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import appStore from "./store/appStore";
import { addUser, removeUser } from "./store/userSlice";
import authService from "./services/authService";
import { injectStore } from "./services/api";
import AllMentors from "./pages/findMentor/AllMentors";
import MentorAvailability from "./pages/dashboard/mentor/MentorAvailability";
import MentorDashboard from "./pages/dashboard/mentor/MentorDashboard";
import UserProfile from "./pages/UserProfile";
import AboutUs from "./pages/AboutUs";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailure from "./pages/payment/PaymentFailure";
import UserBookings from "./pages/bookings/UserBookings";
import ChatSession from "./pages/session/ChatSession";
import VideoSession from "./pages/session/VideoSession";
import CallSession from "./pages/session/CallSession";


const AppContent = () => {
  const user = useSelector((store) => store.user);
  const isAuthenticated = !!user;

  const PrivateRoute = ({ children }) => {
    if (isAuthenticated) {
      return children;
    }
    return <Navigate to="/auth" />
  };

  // Admin route protection - check if user is admin
  const AdminRoute = ({ children }) => {
    if (isAuthenticated && user?.user?.role === 'admin') {
      return children;
    }
    return <Navigate to="/" />
  };

  // Mentor route protection - check if user is mentor
  const MentorRoute = ({ children }) => {
    if (isAuthenticated && (user?.user?.role === 'mentor' || user?.user?.role === 'admin')) {
      return children;
    }
    return <Navigate to="/" />
  };

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Login />} />

        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/become-mentor" element={<BecomeMentor />} />
        <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />
        <Route path="/bookings" element={<PrivateRoute><UserBookings /></PrivateRoute>} />
        <Route path="/session/chat/:bookingId" element={<PrivateRoute><ChatSession /></PrivateRoute>} />
        <Route path="/session/video/:bookingId" element={<PrivateRoute><VideoSession /></PrivateRoute>} />
        <Route path="/session/call/:bookingId" element={<PrivateRoute><CallSession /></PrivateRoute>} />

        {/* Admin Dashboard - Protected */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Mentor Dashboard Routes */}
        <Route
          path="/mentor/dashboard"
          element={
            <MentorRoute>
              <MentorDashboard />
            </MentorRoute>
          }
        />
        <Route
          path="/mentor/availability"
          element={
            <MentorRoute>
              <MentorAvailability />
            </MentorRoute>
          }
        />

        {/* Main Browse Page */}
        <Route path="/find-mentor" element={<AllMentors />} />

        {/* AI Match Form (Potentially Protected) */}
        <Route
          path="/match"
          element={
            <PrivateRoute>
              <AiMentorMatch />
            </PrivateRoute>
          }
        />

        <Route path="/blogs" element={<Blog />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/mentor/:id" element={<MentorDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

// Create a wrapper component to use hooks inside Provider
const AppWrapper = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          if (userData.success) {
            // We need to pass both user and token to match the structure expected by login/register
            dispatch(addUser({ user: userData.data, token: token }));
          }
        } catch (error) {
          console.error("Session restore failed:", error);
          localStorage.removeItem('token');
          dispatch(removeUser());
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <AppContent />;
};

const Applayout = () => {
  injectStore(appStore);
  return (
    <Provider store={appStore}>
      <AppWrapper />
    </Provider>
  );
};

export default Applayout;
