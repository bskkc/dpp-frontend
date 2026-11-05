import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return <div className="not-found"><span>404</span><h1>Bu sayfa bulunamadı</h1><p>Aradığın sayfa taşınmış veya artık mevcut değil.</p><Link className="button button-dark" to="/">Genel bakışa dön <ArrowRight size={15} /></Link></div>;
}

export default NotFoundPage;
