## Video Günlüğüm (Expo / React Native)

Kısa video günlükleri oluşturup saklayabileceğiniz bir mobil uygulama. Telefonda mevcut bir videodan 5 saniyelik bir kesit seçer, ad ve açıklama gibi metaveri ekler, küçük görsel (thumbnail) üretir ve hepsini cihazda yerel olarak saklar. Uygulama; listeleme, arama, paylaşma, düzenleme ve silme işlemlerini destekler.

> Not: Mevcut sürüm, videoyu gerçekten kırpmak yerine DEMO amaçlı dosyayı kopyalar ve oynatma seviyesinde 5 saniyelik bir kesiti simüle eder. Gerçek kırpma için FFmpeg entegrasyonu planlanmıştır.

---

### Özellikler

- Video seçimi: Galeri, kamera veya dosya yöneticisinden seçim
- 3 adımlı akış: Seçim → (Kırpma – demo) → Metaveri ekleme
- Metaveri: Zorunlu ad, isteğe bağlı açıklama, doğrulamalar (Zod)
- Küçük görsel: Seçilen zaman koduna göre thumbnail üretimi
- Yerel veritabanı: SQLite üzerinde kalıcı saklama ve indeksler
- Listeleme ve arama: Ada/açıklamaya göre filtreleme, sonuç istatistikleri
- Detay ekranı: Oynatma (kesit simülasyonu), paylaşma, silme
- Düzenleme: Ad ve açıklama güncelleme

---

### Kullanılan Teknolojiler

- React Native 0.79, React 19, TypeScript
- Expo Router 5 (dosya tabanlı navigasyon)
- Expo Video (oynatıcı), Expo Image/Document Picker, Media Library, File System
- Expo SQLite (yerel veritabanı)
- TanStack React Query (mutasyon/önbellek orkestrasyonu)
- Zustand (global durum yönetimi)
- Zod (form/doğrulama şemaları)
- NativeWind/Tailwind (stil)
- Ionicons, LinearGradient
- FFmpeg Kit (bağımlılık mevcut, gerçek kırpma için TODO)

---

### Kurulum ve Çalıştırma

Önkoşullar: Node 18+, npm veya yarn, Expo CLI.

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. Geliştirme sunucusunu başlatın:

```bash
npx expo start
```

3. Cihaz/Sanal cihazda çalıştırın:

- iOS: `i` (Xcode/simulator gerekir)
- Android: `a` (Android emulator/SDK gerekir)

Notlar:

- FFmpeg ile gerçek kırpma henüz devre dışı. FFmpeg entegrasyonu için bare workflow/prebuild gerekebilir: `npx expo prebuild` (iOS/Android yerellerini oluşturur).
- Web hedefi test edilmemiştir.

---

### Klasör Yapısı (Özet)

```
app/                      # Expo Router ekranları
  _layout.tsx            # Uygulama kök layout
  (tabs)/                # Sekmeli yapı: liste, detay, düzenle
src/
  components/            # UI bileşenleri ve modal adımları
  database/              # SQLite şema ve erişim katmanı
  hooks/                 # Özel hook'lar (örn. arama, işleme)
  providers/             # React Query provider
  schemas/               # Zod şemaları ve tipler
  services/              # Video işleme, dosya/thumbnail servisleri
  store/                 # Zustand veri mağazası
  utils/                 # Doğrulama yardımcıları
```

Önemli dosyalar:

- `src/database/schema.ts`: `videos` tablosu şeması ve indeksler
- `src/database/videoDatabase.ts`: CRUD, arama, istatistik, sayfalama
- `src/services/videoService.ts`: Video kopyalama (demo), thumbnail üretimi, silme
- `src/components/VideoPlayer.tsx`: Kesit simülasyonlu oynatıcı (start/end)
- `src/components/modal/CropModal.tsx`: 3 adımlı modal akış yönetimi
- `src/hooks/useVideoProcessing.ts`: İşleme mutasyonu + başarı durumunda store güncelleme
- `src/store/videoStore.ts`: Zustand + SQLite entegrasyonu

---

### Veri Modeli (Video)

Uygulama alan modeli (`VideoItem`) veritabanı satırı (`videos` tablosu) ile eşlenir:

- id: string (örn. `video_169...`)
- name: string (1–50 karakter, zorunlu)
- description: string (0–200 karakter)
- videoUri: string (cihaz içi yol)
- thumbnailUri?: string (cihaz içi yol)
- duration: number (saniye)
- cropInfo?: { startTime, endTime, duration } (oynatıcıda kesit simülasyonu)
- createdAt: Date
- updatedAt?: Date

SQLite sütunları: `id, name, description, video_uri, thumbnail_uri, duration, created_at, updated_at` (+ `created_at`, `name` indeksleri).

---

### Uygulama Akışı

- Ana ekran (liste): Kayıtlı videoları gösterir, arama çubuğu ile filtreler. Silme işlemi doğrulama modali ile yapılır.
- Video ekleme: Sekmesinden 3 adımlı modal açılır:
  - Seçim: Galeri/kamera/dosya yöneticisi
  - Kırpma (DEMO): FFmpeg henüz devre dışı; seçilen kesit oynatıcıda simüle edilir
  - Metaveri: İsim ve açıklama doğrulama sonrası kaydedilir
- Detay: Oynatma, paylaşma, silme; sürenin/oluşturma tarihinin gösterimi
- Düzenleme: İsim ve açıklama güncelleme

Doğrulamalar (Zod):

- İsim: min 1, max 50
- Açıklama: max 200
- Kesit: süre min 0.1s, max 5s; `endTime > startTime`

---

### Yol Haritası / Bilinen Sınırlamalar

- [FFmpeg] Gerçek video kırpma: `trimVideoWithFFmpeg` TODO (şu an kopyalama + simülasyon)
- Kırpma arayüzü: `VideoCropping.tsx` bileşenini işlevsel hale getirme
- Dosya yaşam döngüsü: Eski dosyaların otomatik temizliği/taşınması
- Testler: Jest/Jest Expo ile birim/entegrasyon testleri
- Web desteği: Oynatıcı ve dosya API'leri için uyumluluk değerlendirmesi

---

### Hızlı İpuçları

- Veritabanı tek seferde açılır ve eşzamanlı API (expo-sqlite) ile çalışır.
- Thumbnail üretimi `expo-video-thumbnails` ile yapılır; kalite/performans ayarlanabilir.
- Arama hem SQLite üzerinden hem de local fallback ile yapılır.
