import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function MainLayout({
  children,
  selectedCompany,
  setSelectedCompany,
}) {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() =>
          setIsSidebarOpen(false)
        }
      />

      {isSidebarOpen && (
        <div
          onClick={() =>
            setIsSidebarOpen(false)
          }
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.4)",
            zIndex: 998,
          }}
        />
      )}

      <div
        style={{
          background: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        <Navbar
          selectedCompany={
            selectedCompany
          }
          setSelectedCompany={
            setSelectedCompany
          }
          toggleSidebar={() =>
            setIsSidebarOpen(
              !isSidebarOpen
            )
          }
        />

        <main
          style={{
            padding: "20px",
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
}

export default MainLayout;