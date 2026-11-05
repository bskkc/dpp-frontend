import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ImportPage from "./pages/ImportPage";
import NotFoundPage from "./pages/NotFoundPage";
import OverviewPage from "./pages/OverviewPage";
import PassportPage from "./pages/PassportPage";
import ProductsPage from "./pages/ProductsPage";

function App() {
  return (
    <Routes>
      <Route path="/dpp/:gtin" element={<PassportPage />} />
      <Route element={<DashboardLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="urunler" element={<ProductsPage />} />
        <Route path="aktarim" element={<ImportPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
