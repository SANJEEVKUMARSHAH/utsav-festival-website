import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollTop from "./components/ScrollTop";
import Home from "./pages/Home";
import ChhathExplorer from "./pages/ChhathExplorer";
import RangoliStudio from "./pages/RangoliStudio/RangoliStudio";
import TiharExperience from "./pages/TiharExperience";
import About from "./pages/About";
import Countdown from "./pages/Countdown";
import RitualGuide from "./pages/RitualGuide";
import Gallery from "./pages/Gallery";
import Wishes from "./pages/Wishes";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import SeoManager from "./components/SeoManager";

export default function AppRoutes() {
  return <>
    <SeoManager />
    <ScrollTop />
    <Header />
    <RouteErrorBoundary routeName="application">
      <Routes>
      <Route
        path="/"
        element={<Home />}
      />
      <Route
        path="/chhath"
        element={<ChhathExplorer />}
      />
      <Route
        path="/rangoli-studio"
        element={<RangoliStudio />}
      />
      <Route
        path="/tihar"
        element={<TiharExperience />}
      />
      <Route
        path="/about"
        element={<About />}
      />
      <Route
        path="/countdown"
        element={<Countdown />}
      />
      <Route
        path="/ritual-guide"
        element={<RitualGuide />}
      />
      <Route
        path="/gallery"
        element={<Gallery />}
      />
      <Route
        path="/wishes"
        element={<Wishes />}
      />
      <Route
        path="/calendar"
        element={<RouteErrorBoundary routeName="Calendar"><Calendar /></RouteErrorBoundary>}
      />
      <Route
        path="*"
        element={<NotFound />}
      />
      </Routes>
    </RouteErrorBoundary>
    <Footer />
  </>;
}