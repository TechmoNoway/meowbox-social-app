import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Loader from "@/components/shared/Loader";
import Topbar from "@/components/shared/Topbar";
import { useUserContext } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const RootLayout = () => {
  const { isAuthenticated, isLoading } = useUserContext();

  if (isLoading) {
    return (
      <div className="flex-center w-full h-screen bg-dark-1">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div className="w-full md:flex min-h-screen bg-dark-1 text-light-1">
      <Topbar />
      <LeftSidebar />

      <main className="flex flex-1 h-screen overflow-hidden pb-16 md:pb-0">
        <Outlet />
      </main>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
