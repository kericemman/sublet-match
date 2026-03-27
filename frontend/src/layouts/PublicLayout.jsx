import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import FloatingNewsletterIcon from "../components/common/FloatingNewsletter";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <FloatingNewsletterIcon/>
      <Footer />
    </div>
  );
};

export default PublicLayout;