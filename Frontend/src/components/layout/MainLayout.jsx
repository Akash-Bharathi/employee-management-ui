import Navbar from "./Navbar";

function MainLayout({
  children,
  selectedCompany,
  setSelectedCompany,
}) {
  return (
    <>
      <Navbar
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />

      <main
        style={{
          background: "#f5f7fb",
          minHeight: "calc(100vh - 64px)",
          padding: "20px",
        }}
      >
        {children}
      </main>
    </>
  );
}

export default MainLayout;