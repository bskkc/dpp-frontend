import { useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Factory,
  Leaf,
  PackageCheck,
  QrCode,
  ShieldCheck,
  Upload,
  Check,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { EmptyState, LoadingState } from "../components/PageStates";
import ProductTable from "../components/ProductTable";
import type { DashboardOutletContext } from "../layouts/DashboardLayout";

function OverviewPage() {
  const { products, loading } = useOutletContext<DashboardOutletContext>();
  const navigate = useNavigate();
  const locations = useMemo(() => new Set(products.map((product) => product.productionLocation)).size, [products]);

  return (
    <div className="page-content">
      <div className="page-heading heading-with-action">
        <div><div className="eyebrow">GENEL BAKIŞ</div><h1>Merhaba, ESG Next <span className="wave">✳</span></h1><p>Ürün verilerin ve dijital pasaportların tek ekranda.</p></div>
        <button className="button button-dark" onClick={() => navigate("/aktarim")}><Upload size={16} /> CSV içe aktar</button>
      </div>
      <section className="welcome-card">
        <div className="welcome-copy">
          <span className="welcome-tag"><span /> DİJİTAL ÜRÜN PASAPORTU</span>
          <h2>Şeffaf bir gelecek,<br />her ürünle başlar.</h2>
          <p>Ürün bilgilerini yönet, doğrula ve herkes için erişilebilir bir pasaporta dönüştür.</p>
          <Link className="welcome-link" to="/urunler">Ürün kataloğunu keşfet <ArrowRight size={16} /></Link>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="art-product"><span className="art-stitch" /><span className="art-label"><Leaf size={16} /><small>DPP<br />001</small></span></div>
          <div className="art-leaf leaf-one"><Leaf size={30} /></div><div className="art-leaf leaf-two"><Leaf size={23} /></div>
          <div className="floating-badge"><ShieldCheck size={15} /> İzlenebilir</div>
        </div>
      </section>
      <section className="metric-grid" aria-label="Özet istatistikler">
        <MetricCard icon={<PackageCheck size={18} />} label="Kayıtlı ürün" value={loading ? "—" : products.length.toString().padStart(2, "0")} caption="Dijital kimliği hazır" tone="green" />
        <MetricCard icon={<Factory size={18} />} label="Üretim lokasyonu" value={loading ? "—" : locations.toString().padStart(2, "0")} caption="Farklı şehir" tone="blue" />
        <MetricCard icon={<QrCode size={18} />} label="Pasaport durumu" value={loading ? "—" : products.length ? "%100" : "—"} caption="Erişime hazır" tone="amber" />
      </section>
      <section className="section-block">
        <div className="section-heading"><div><div className="eyebrow">ÜRÜN ENVANTERİ</div><h2>Son eklenen ürünler</h2></div><Link className="text-link" to="/urunler">Tüm ürünleri gör <ArrowUpRight size={15} /></Link></div>
        {loading ? <LoadingState /> : products.length ? <ProductTable products={products.slice(0, 4)} /> : <EmptyState onUpload={() => navigate("/aktarim")} />}
      </section>
      <footer className="page-footer"><span>ESG Next <span className="footer-dot">•</span> Mini Dijital Ürün Pasaportu</span><span>Şeffaflıkla, daha iyi bir gelecek için.</span></footer>
    </div>
  );
}

function MetricCard({ icon, label, value, caption, tone }: { icon: ReactNode; label: string; value: string; caption: string; tone: string }) {
  return <article className="metric-card"><span className={`metric-icon ${tone}`}>{icon}</span><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-caption"><span className="tiny-check"><Check size={11} /></span>{caption}</div></article>;
}

export default OverviewPage;
