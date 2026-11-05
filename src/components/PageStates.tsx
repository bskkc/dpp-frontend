import { LoaderCircle, PackageCheck, Upload } from "lucide-react";

export function LoadingState() {
  return <div className="loading-state"><LoaderCircle size={20} className="spin" /> Ürünler yükleniyor...</div>;
}

export function EmptyState({ onUpload }: { onUpload: () => void }) {
  return <div className="empty-state"><div><PackageCheck size={24} /></div><strong>Henüz ürün eklenmemiş</strong><p>CSV dosyanı yükleyerek ürün pasaportlarını oluşturmaya başla.</p><button className="button button-dark" onClick={onUpload}><Upload size={15} /> İlk CSV dosyanı yükle</button></div>;
}
