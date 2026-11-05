import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  Leaf,
  LoaderCircle,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../api";
import type { Product } from "../types";

function PassportPage() {
  const { gtin = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const authorized = new URLSearchParams(location.search).get("rol") === "yetkili";
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getProduct(gtin, authorized)
      .then(setProduct)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [gtin, authorized]);

  if (loading) return <div className="passport-loading"><LoaderCircle className="spin" /> Pasaport yükleniyor...</div>;
  if (error || !product) return <div className="passport-error"><div className="passport-error-icon"><PackageCheck size={24} /></div><h1>Ürün bulunamadı</h1><p>{error || "Bu GTIN için bir pasaport kaydı bulunamadı."}</p><Link className="button button-dark" to="/urunler">Ürün kataloğuna dön</Link></div>;

  const qrUrl = `/api/products/${encodeURIComponent(product.gtin)}/qr`;
  return <div className="passport-page">
    <header className="passport-nav"><Link className="passport-brand" to="/"><span className="brand-mark"><Leaf size={19} /></span><strong>esg<span>next</span></strong></Link><span className="passport-label"><span /> DİJİTAL ÜRÜN PASAPORTU</span><Link className="passport-admin-link" to="/urunler">Yönetim paneli <ArrowUpRight size={15} /></Link></header>
    <main className="passport-main">
      <div className="passport-overline"><span className="passport-check"><Check size={13} /></span> DOĞRULANMIŞ ÜRÜN KİMLİĞİ <span className="overline-line" /></div>
      <section className="passport-hero"><div><div className="passport-category">DENİM KOLEKSİYONU <span>·</span> {product.productionLocation.toLocaleUpperCase("tr")}</div><h1>{product.modelName}</h1><p>Her ürünün hikâyesi, üretildiği yerden başlar. Bu pasaport ürünün materyal ve izlenebilirlik bilgilerini içerir.</p></div><div className="passport-product-art" aria-hidden="true"><div className="denim-art"><span className="denim-seam" /><span className="denim-pocket" /><span className="denim-tag"><Leaf size={15} /></span></div><span className="art-caption">PRODUCT IDENTITY <span>№ {product.gtin.slice(-5)}</span></span></div></section>
      <section className="passport-details">
        <div className="passport-detail-heading"><div><span className="eyebrow">ÜRÜN BİLGİLERİ</span><h2>Ürünün dijital kimliği</h2></div><span className="verified-pill"><ShieldCheck size={15} /> İzlenebilir ürün</span></div>
        <div className="passport-facts">
          <Fact label="GTIN / ÜRÜN KİMLİĞİ" value={product.gtin} mono />
          <Fact label="MODEL ADI" value={product.modelName} />
          <Fact label="ÜRETİM LOTU" value={product.batchNumber} mono />
          <Fact label="ÜRETİM YERİ" value={product.productionLocation} />
          <Fact label="PAMUK" value={`${product.cottonPercent}%`} sub="Ürün materyal içeriği" />
          <Fact label="ELASTAN" value={`${product.elastanePercent}%`} sub="Ürün materyal içeriği" />
          {authorized && <Fact label="KARBON AYAK İZİ" value={product.carbonKgCo2e == null ? "—" : `${product.carbonKgCo2e} kg CO₂e`} sub="Üretim lotu başına" highlight />}
        </div>
      </section>
      <section className="passport-bottom"><div className="qr-card"><img src={qrUrl} alt={`${product.modelName} dijital pasaport QR kodu`} /><div><strong>Pasaportu paylaş</strong><span>QR kodunu tarayarak bu ürünün pasaportuna ulaş.</span><a href={qrUrl} download={`${product.gtin}-qr.png`}><ArrowDownToLine size={14} /> QR kodunu indir</a></div></div>
        <button className={`role-toggle ${authorized ? "role-active" : ""}`} onClick={() => navigate(authorized ? `/dpp/${gtin}` : `/dpp/${gtin}?rol=yetkili`)}><ShieldCheck size={16} />{authorized ? "Yetkili görünüm açık" : "Yetkili görünüm"}<span>{authorized ? "Kapat" : "Aç"} <ArrowRight size={13} /></span></button>
      </section>
      <div className="passport-json-link"><a href={`/dpp/${encodeURIComponent(product.gtin)}.jsonld${authorized ? "?rol=yetkili" : ""}`} target="_blank" rel="noreferrer">Makine tarafından okunabilir veri <ArrowUpRight size={14} /></a><span>Son güncelleme: {formatDate(product.updatedAt)}</span></div>
    </main>
    <footer className="passport-footer"><Link className="passport-brand" to="/"><span className="brand-mark"><Leaf size={17} /></span><strong>esg<span>next</span></strong></Link><span>Şeffaflıkla, daha iyi bir gelecek için.</span><span>Mini Dijital Ürün Pasaportu</span></footer>
  </div>;
}

function Fact({ label, value, sub, mono, highlight }: { label: string; value: string; sub?: string; mono?: boolean; highlight?: boolean }) {
  return <div className={`passport-fact ${highlight ? "fact-highlight" : ""}`}><span>{label}</span><strong className={mono ? "mono" : ""}>{value}</strong>{sub && <small>{sub}</small>}</div>;
}

const formatDate = (date: string) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));

export default PassportPage;
