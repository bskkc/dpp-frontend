import { useState } from "react";
import { CircleHelp, Search, Upload, X } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { LoadingState } from "../components/PageStates";
import ProductTable from "../components/ProductTable";
import type { DashboardOutletContext } from "../layouts/DashboardLayout";

function ProductsPage() {
  const { products, loading, error } = useOutletContext<DashboardOutletContext>();
  const [query, setQuery] = useState("");
  const filtered = products.filter((product) => `${product.modelName} ${product.gtin} ${product.batchNumber} ${product.productionLocation}`.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr")));

  return <div className="page-content">
    <div className="page-heading heading-with-action"><div><div className="eyebrow">ENVANTER</div><h1>Ürün kataloğu</h1><p>Ürünlerini ve pasaport durumlarını görüntüle.</p></div><Link className="button button-dark" to="/aktarim"><Upload size={16} /> CSV içe aktar</Link></div>
    <div className="catalog-toolbar"><div className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Model, GTIN veya lot ara..." aria-label="Ürün ara" />{query && <button aria-label="Aramayı temizle" onClick={() => setQuery("")}><X size={15} /></button>}</div><span className="result-count">{error ? "Veri alınamadı" : `${filtered.length} ürün`}</span></div>
    {loading ? <LoadingState /> : error ? <div className="empty-search" role="alert"><CircleHelp size={22} /><strong>Ürünler yüklenemedi</strong><span>API ve PostgreSQL bağlantısını kontrol edin. Ürün listesi şu anda alınamıyor.</span></div> : filtered.length ? <ProductTable products={filtered} /> : <div className="empty-search"><Search size={22} /><strong>Sonuç bulunamadı</strong><span>Arama terimini değiştirip tekrar dene.</span></div>}
    <footer className="page-footer"><span>GTIN başındaki sıfırlar korunarak saklanır.</span><span>{error ? "Bağlantı kontrol edilmeli" : `${products.length} kayıtlı ürün`}</span></footer>
  </div>;
}

export default ProductsPage;
