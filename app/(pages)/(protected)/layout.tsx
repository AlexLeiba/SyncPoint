import { SideBar } from "@/components/Navigations/SideBar";
import React from "react";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SideBar />

      <main className="overflow-y-auto h-screen">{children}</main>
    </>
  );
}

export default AppLayout;
