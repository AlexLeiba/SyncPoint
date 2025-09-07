import { SideBar } from "@/components/Navigations/SideBar";
import React from "react";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SideBar />

      <main className="overflow-y-auto h-full">{children}</main>
    </>
  );
}

export default AppLayout;
