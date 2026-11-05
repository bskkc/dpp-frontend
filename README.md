# Mini DPP Frontend

React, TypeScript ve Vite ile geliştirilmiş frontend uygulaması.

## Yapı

- `src/App.tsx`: Uygulama rotalarını tanımlar ve sayfaları içe aktarır.
- `src/pages/`: Genel bakış, ürün kataloğu, CSV aktarımı, ürün pasaportu ve bulunamayan sayfa ekranları.
- `src/layouts/`: Sayfalar arasında paylaşılan yönetim paneli kabuğu ve ürün verisi.
- `src/components/`: Sayfalar arasında kullanılan ortak arayüz bileşenleri.

## Gereksinimler

- Node.js 18 veya üzeri
- npm

## Kurulum ve çalıştırma

Frontend klasöründe terminal açın ve bağımlılıkları yükleyin:

```bash
npm install
```

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Vite, terminalde uygulamanın yerel adresini (genellikle `http://localhost:5173`) gösterecektir. 

## Backend bağlantısı

Vite geliştirme sunucusu `/api` ve `/dpp` isteklerini `http://localhost:5080` adresindeki backend'e yönlendirir. Ürün ve CSV içe aktarma özelliklerini kullanmak için ASP.NET Core backend'in ve PostgreSQL servisinin çalışıyor olması gerekir.

## Üretim derlemesi

TypeScript kontrollerini çalıştırıp üretim derlemesi oluşturmak için:

```bash
npm run build
```

Derlemeyi yerel olarak önizlemek için:

```bash
npm run preview
```
