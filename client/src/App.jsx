import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Assessment from "./pages/Assessment.jsx";
import Results from "./pages/Results.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-calm-mist text-calm-ink antialiased">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Assessment />} />
          <Route path="/resultats" element={<Results />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
