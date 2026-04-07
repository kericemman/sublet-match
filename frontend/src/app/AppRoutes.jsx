import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

import PublicLayout from "../layouts/PublicLayout";
import LandlordLayout from "../layouts/LandlordLayout";
import AdminLayout from "../layouts/AdminLayout";







import HomePage from "../pages/public/Home";
import ListingsPage from "../pages/public/ListingPage";
import LandlordLoginPage from "../pages/landlord/LandlordLogin";
import LandlordDashboard from "../pages/landlord/LandlordDashboard";
import NotFound from "../pages/public/NotFound";
import LandlordRegisterPage from "../pages/landlord/LandlordRegister";
import AdminLoginPage from "../pages/admin/AdminLogin";
import AdminDashboardPage from "../pages/admin/AdminDashboard";
import MyListings from "../pages/landlord/MyListings";
import CreateListing from "../pages/landlord/CreateListing";
import EditListing from "../pages/landlord/EditListing";
import MyInquiries from "../pages/landlord/MyInquiries";
import ListingDetailsPage from "../pages/public/ListingDetailss";
import ManageNewsletterPage from "../pages/admin/ManageNewsletter";
import ManageBlogsPage from "../pages/admin/ManageBlog";
import ManageInquiriesPage from "../pages/admin/ManageInquiries";
import ManageListingsPage from "../pages/admin/ManageListing";
import ManageLandlordsPage from "../pages/admin/ManageLandlord";
import BlogPage from "../pages/public/BlogPage";
import TermsOfService from "../pages/public/Terms";
import SafetyTips from "../pages/public/Safety";
import AboutPage from "../pages/public/About";
import ContactPage from "../pages/public/ContactPage";
import ManageContactsPage from "../pages/admin/ManageContact";
import SupportPage from "../pages/landlord/LandlordSupport";
import SupportTicketPage from "../pages/landlord/SupportTicket";
import ManageSupportPage from "../pages/admin/AdminSupport";
import SupportTicketAdminPage from "../pages/admin/AdminSupportTicket";
import ForgotPasswordPage from "../pages/public/ForgotPasswordPage";
import ResetPasswordPage from "../pages/public/ResetPasswordPage";
import BlogDetailsPage from "../pages/public/BlogDetails";
import ManageFeedbackPage from "../pages/admin/Adminfeedback";
import FeedbackPage from "../pages/public/Feedback";


const ProtectedLandlordRoute = ({ children }) => {
  const { loading, isAuthenticated, isLandlord } = useAuth();

  if (loading) return <Loader />;
  if (!isAuthenticated || !isLandlord) {
    return <Navigate to="/landlord/login" replace />;
  }

  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) return <Loader />;
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage/>} />
        <Route path="/listings/:id" element={<ListingDetailsPage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailsPage />} />
        <Route path="/terms-of-service" element={<TermsOfService/>}/>
        <Route path="/safety-tips" element={<SafetyTips/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/contact" element={<ContactPage />}/>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      
      </Route>

      <Route path="/landlord/login" element={<LandlordLoginPage/>} />
      <Route path="/landlord/register" element={<LandlordRegisterPage />} />

      <Route
        path="/landlord"
        element={
          <ProtectedLandlordRoute>
            <LandlordLayout />
          </ProtectedLandlordRoute>
        }
      >
        <Route path="dashboard" element={<LandlordDashboard />} />
        <Route path="listings" element={<MyListings />} />
        <Route path="listings/create" element={<CreateListing />} />
        <Route path="listings/:id/edit" element={<EditListing />} />
        <Route path="inquiries" element={<MyInquiries />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="support/:id" element={<SupportTicketPage />} />
        
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="landlords" element={<ManageLandlordsPage />} />
        <Route path="listings" element={<ManageListingsPage/>} />
        <Route path="inquiries" element={<ManageInquiriesPage/>} />
        <Route path="blogs" element={<ManageBlogsPage />} />
        <Route path="newsletters" element={<ManageNewsletterPage />} />
        <Route path="contacts" element={<ManageContactsPage />} />
        <Route path="admin-support" element={<ManageSupportPage />} />
        <Route path="admin-support/:id" element={<SupportTicketAdminPage />} />
        <Route path="feedback" element={<ManageFeedbackPage/>}/>
        
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;