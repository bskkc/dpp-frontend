import { ArrowUpRight, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../types";

function ProductTable({ products }: { products: Product[] }) {
  return <div className="table-card"><table><thead><tr><th>ÜRÜN MODELİ</th><th>GTIN</th><th>ÜRETİM YERİ</th><th>LOT NO</th><th>DURUM</th><th /></tr></thead><tbody>
    {products.map((product) => <tr key={product.gtin}>
      <td><Link className="product-cell" to={`/dpp/${product.gtin}`}><span className="product-thumb"><PackageCheck size={17} /></span><span><strong>{product.modelName}</strong><small>{product.cottonPercent}% pamuk · {product.elastanePercent}% elastan</small></span></Link></td>
      <td><span className="mono">{product.gtin}</span></td><td><span className="location-cell"><span />{product.productionLocation}</span></td>
      <td><span className="mono muted">{product.batchNumber}</span></td><td><span className="table-status"><span />Aktif</span></td>
      <td><Link aria-label={`${product.modelName} pasaportunu aç`} className="row-arrow" to={`/dpp/${product.gtin}`}><ArrowUpRight size={17} /></Link></td>
    </tr>)}
  </tbody></table></div>;
}

export default ProductTable;
