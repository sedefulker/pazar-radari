# Pazar Radarı

Pazar Radarı; kooperatiflerin ve KOBİ'lerin operasyonel süreçlerinde meydana gelen stok yetersizliği ve lojistik gecikme gibi aksaklıkları (anomali) bulut veritabanı üzerinden gerçek zamanlı olarak tespit eden ve bu risklere karşı yapay zeka destekli otonom çözüm senaryoları üreten bir karar destek platformudur.

Platform, verileri sadece ekranda listeleyen pasif panellerin aksine; riski kendisi algılayan, internete bağlanıp harici pazar araştırmasını yürüten ve yöneticiye anlık çözüm taslakları sunan proaktif bir mimariye sahiptir.

## 🏗️ Sistem Mimarisi ve Veri Akışı

Sistem, mikrofonksiyonel bileşenlerin birbirleriyle asenkron olarak haberleştiği 4 temel katmandan oluşmaktadır:

1. **Veri Katmanı (Supabase / PostgreSQL):** Canlı stok seviyeleri, sipariş durumları ve sistemin ürettiği geçmiş kararlar bulut tabanlı ilişkisel veritabanında saklanır.
2. **Analiz ve Karar Motoru (FastAPI Backend):** Arka plan mekanizması veritabanını sürekli filtreler. Stok seviyesi kritik eşiğin altına düştüğünde veya kargo teslimatı geciktiğinde bir anomali tetikler.
3. **Otonom Çözüm Üretimi (Gemini 2.5 Flash Lite):** Tetiklenen anomali türüne göre Gemini API çağrılır. İnsan müdahalesi olmadan tedarikçi için resmi bir e-posta taslağı veya müşteri için bilgilendirme metni hazırlanır. Ayrıca canlı internet araması yapılarak Türkiye e-ticaret pazarındaki güncel fiyat trendleri analiz edilir.
4. **Haberleşme ve Sunum Katmanı (Telegram & React):** Üretilen stratejik kararlar Telegram Bot API üzerinden yöneticinin cep telefonuna anlık bildirim olarak iletilir ve eş zamanlı olarak React tabanlı yönetim paneline yansıtılır.

## 🛠️ Teknolojik Altyapı (Tech Stack)

* **Backend:** FastAPI (Python), Uvicorn
* **Frontend:** React.js (Plus Jakarta Sans tipografisi ve SaaS arayüz tasarımı)
* **Veritabanı:** Supabase (Bulut tabanlı PostgreSQL)
* **Yapay Zeka Modeli:** Gemini 2.5 Flash Lite (Metin üretimi ve canlı web araması)
* **Görev Zamanlayıcı:** APScheduler (Arka plan rutin iş akışları)
* **Anlık Bildirim Hattı:** Python Telegram Bot API

## 💎 Öne Çıkan Özellik: Karar Hafızası (Caching)

Yapay zeka bütçesini ve token tüketimini optimize etmek amacıyla sistem mimarisine bir **Karar Hafızası** entegre edilmiştir. Sistem bir risk algıladığında doğrudan Gemini API'ye istek atmak yerine, önce veritabanındaki geçmiş kararlar tablosunu tarar. Eğer ilgili ürün veya siparişle alakalı gün içinde zaten bir aksiyon planı üretilmişse, yapay zeka çağrısı tamamen bypass edilerek veri doğrudan bulut hafizasından getirilir. Bu optimizasyon sayesinde API harcamalarında **%90'a varan maliyet tasarrufu** sağlanmaktadır.

## 📁 Proje Dosya Yapısı

```text
pazar-radari/
├── backend/
│   ├── main.py          # API başlangıç noktası ve zamanlanmış görevlerin kuruluşu
│   ├── agent.py         # Gemini API entegrasyonu ve karar mekanizmaları
│   ├── database.py      # Supabase bağlantısı ve veri okuma/yazma katmanı
│   ├── tools.py         # Yardımcı araçlar ve mesaj taslağı fonksiyonları
│   └── .env             # Gizli API anahtarları ve veritabanı bağlantı bilgileri
└── frontend/
    ├── src/
    │   ├── App.js       # SaaS paneli arayüzü ve tema yönetimi ana dosyası
    │   └── ...          # Menüler ve ekran bileşenleri
