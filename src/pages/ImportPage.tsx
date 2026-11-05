import { useState } from "react";
import {
  ArrowRight,
  Check,
  FileCheck2,
  FileSpreadsheet,
  Leaf,
  LoaderCircle,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { importCsv } from "../api";
import type { DashboardOutletContext } from "../layouts/DashboardLayout";
import type { ImportResult } from "../types";

function ImportPage() {
  const { refresh } = useOutletContext<DashboardOutletContext>();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);

  const upload = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const imported = await importCsv(file);
      setResult(imported);
      try {
        await refresh();
      } catch (reason) {
        const detail = reason instanceof Error ? ` (${reason.message})` : "";
        setError(`CSV aktarım sonucu alındı ancak ürün listesi yenilenemedi${detail}.`);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "CSV aktarımı başarısız oldu.");
    } finally {
      setBusy(false);
    }
  };

  const chooseFile = (selected: File | undefined) => {
    setResult(null);
    setError("");
    if (selected && !selected.name.toLocaleLowerCase("tr").endsWith(".csv")) {
      setError("Lütfen .csv uzantılı bir dosya seçin.");
      setFile(null);
      return;
    }
    if (selected && selected.size > 10 * 1024 * 1024) {
      setError("CSV dosyası 10 MB sınırını aşamaz.");
      setFile(null);
      return;
    }
    setFile(selected ?? null);
  };

  return <div className="page-content">
    <div className="page-heading"><div><div className="eyebrow">VERİ YÖNETİMİ</div><h1>CSV aktarımı</h1><p>Ürün verilerini yükle, doğrula ve pasaportlarını oluştur.</p></div></div>
    <div className="import-layout">
      <section className="import-main">
        <div className="panel-card">
          <div className="panel-title"><span className="step-number">01</span><div><h2>CSV dosyanı seç</h2><p>Ürün kayıtlarını içeren .csv dosyasını yükle.</p></div></div>
          <label className={`drop-zone ${dragging ? "dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files[0]); }}>
            <input type="file" accept=".csv,text/csv" onChange={(event) => chooseFile(event.target.files?.[0])} />
            <span className="upload-icon"><Upload size={21} /></span><strong>{file ? file.name : "Dosyanı buraya sürükle"}</strong><span>{file ? `${(file.size / 1024).toFixed(1)} KB · yüklemeye hazır` : <>veya <span className="browse-link">bilgisayarından seç</span></>}</span>
            {!file && <small>CSV formatı · Maksimum 10 MB</small>}
          </label>
          {file && <div className="selected-file"><span className="file-icon"><FileSpreadsheet size={16} /></span><span><strong>{file.name}</strong><small>{(file.size / 1024).toFixed(1)} KB</small></span><button aria-label="Dosyayı kaldır" onClick={() => chooseFile(undefined)}><X size={16} /></button></div>}
          {error && <div className="inline-error" role="alert"><X size={16} />{error}</div>}
          <button className="button button-dark import-button" disabled={!file || busy} onClick={() => void upload()}>{busy ? <><LoaderCircle size={16} className="spin" /> Veriler doğrulanıyor...</> : <><Upload size={16} /> Verileri içe aktar <ArrowRight size={16} /></>}</button>
        </div>
        {result && <ImportReport result={result} />}
      </section>
      <aside className="import-aside">
        <div className="panel-card requirements-card"><div className="aside-icon"><FileCheck2 size={18} /></div><h3>Dosya gereksinimleri</h3><p>Doğru içe aktarma için CSV dosyan bu sütun başlıklarını içermeli:</p><div className="field-list">{["gtin", "model_adi", "batch_no", "elyaf_pamuk_yuzde", "elyaf_elastan_yuzde", "uretim_yeri", "karbon_kg_co2e"].map((field) => <code key={field}>{field}</code>)}</div></div>
        <div className="info-card"><div className="info-head"><ShieldCheck size={16} /><strong>GTIN koruması</strong></div><p>GTIN numaraları metin olarak işlenir; baştaki sıfırlarınız kaybolmaz.</p></div>
        <div className="info-card info-warm"><div className="info-head"><Leaf size={16} /><strong>Akıllı doğrulama</strong></div><p>Hatalı satırlar atlanır; geçerli satırlar yüklenmeye devam eder.</p></div>
      </aside>
    </div>
  </div>;
}

function ImportReport({ result }: { result: ImportResult }) {
  return <section className="report-card" aria-live="polite">
    <div className="report-heading"><span className={result.invalidRows ? "report-warning" : "report-success"}>{result.invalidRows ? <X size={17} /> : <Check size={17} />}</span><div><h2>Aktarım tamamlandı</h2><p>{result.totalRows} satır kontrol edildi</p></div></div>
    <div className="report-metrics"><div><span>Başarılı kayıt</span><strong className="success-text">{result.importedRows}</strong></div><div><span>Hatalı satır</span><strong className={result.invalidRows ? "error-text" : ""}>{result.invalidRows}</strong></div></div>
    {result.errors.length > 0 && <div className="error-list"><strong>Kontrol edilmesi gereken satırlar</strong>{result.errors.map((item) => <div key={`${item.rowNumber}-${item.message}`}><span>Satır {item.rowNumber}</span><p>{item.message}</p></div>)}</div>}
  </section>;
}

export default ImportPage;
