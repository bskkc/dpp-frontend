import { useEffect, useState } from "react";
import {
  ArrowRight,
  Box,
  ChevronDown,
  CircleHelp,
  FileSpreadsheet,
  Leaf,
  Menu,
  PackageCheck,
  ShieldCheck,
  X,
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { getProducts } from "../api";
import type { Product } from "../types";

export interface DashboardOutletContext {
  products: Product[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

function DashboardLayout() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<"checking" | "active" | "unavailable">("checking");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getProducts()
      .then((items) => {
        setProducts(items);
        setApiStatus("active");
      })
      .catch((reason: Error) => {
        setError(reason.message);
        setApiStatus("unavailable");
      })
      .finally(() => setLoading(false));
  }, []);

  const refresh = async () => {
    try {
      const nextProducts = await getProducts();
      setProducts(nextProducts);
      setError("");
      setApiStatus("active");
    } catch (reason) {
      setApiStatus("unavailable");
      throw reason;
    }
  };

  const navigation = [
    { to: "/", label: "Genel bakış", icon: Box, end: true },
    { to: "/urunler", label: "Ürün kataloğu", icon: PackageCheck },
    { to: "/aktarim", label: "CSV aktarımı", icon: FileSpreadsheet },
  ];

  const outletContext: DashboardOutletContext = { products, loading, error, refresh };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><Leaf size={21} strokeWidth={2.2} /></span>
          <span><strong>esg<span>next</span></strong><small>ÜRÜN PASAPORTU</small></span>
        </Link>
        <div className="workspace-label">ÇALIŞMA ALANI</div>
        <nav className="side-nav" aria-label="Ana menü">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <Icon size={18} /><span>{label}</span>{label === "CSV aktarımı"}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <div className="note-icon"><ShieldCheck size={17} /></div>
            <strong>Veriler güvende</strong>
            <p>Her ürünün dijital kimliği tek bir yerde.</p>
            <Link to="/urunler">Ürünlerini gör <ArrowRight size={14} /></Link>
          </div>
          <div className="profile">
            <div className="avatar">E</div>
            <div><strong>ESG Next</strong><small>Demo çalışma alanı</small></div>
            <ChevronDown size={16} className="profile-chevron" />
          </div>
        </div>
      </aside>
      {menuOpen && <button className="sidebar-backdrop" aria-label="Menüyü kapat" onClick={() => setMenuOpen(false)} />}
      <main className="main-panel">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Menüyü aç" onClick={() => setMenuOpen(!menuOpen)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>Çalışma alanı</span><span className="crumb-slash">/</span><strong>Ürün pasaportları</strong></div>
          <div className="topbar-actions"><span className={`status-pill status-${apiStatus}`}><span />{apiStatus === "active" ? "Sistem aktif" : apiStatus === "checking" ? "Bağlantı kontrol ediliyor" : "Bağlantı yok"}</span><button className="icon-button" title="Yardım"><CircleHelp size={18} /></button><div className="top-avatar">E</div></div>
        </header>
        {error && <div className="global-error" role="alert">{error} <button onClick={() => setError("")}><X size={15} /></button></div>}
        <Outlet context={outletContext} />
      </main>
    </div>
  );
}

export default DashboardLayout;
