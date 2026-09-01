import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Topbar from "@/components/shared/Topbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
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
