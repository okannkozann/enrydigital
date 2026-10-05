# Dijital İmalat Formu -- Proje Tanımı ve Geliştirme Gereksinimleri

## 1. Proje Amacı

Bu proje, doğal gaz dağıtım şirketinin sahada kullandığı mevcut kağıt
**"İmalat Formu"nun dijital ve mobil uyumlu versiyonunu** geliştirmek
amacıyla hazırlanmıştır.

Mevcut süreçte yüklenici tarafından gerçekleştirilen doğal gaz altyapı
imalatları sahada kağıt forma elle işlenmektedir. Ay sonunda bu
formlardaki bilgiler dijital ortama/SAP sistemine aktarılmaktadır.

Bu projenin ilk aşamasındaki amaç:

> **Kağıt İmalat Formunda bulunan tüm bilgilerin aynı mantık ve düzen
> korunarak tablet ve mobil cihazlardan kolayca doldurulabilmesini
> sağlamaktır.**

Bu aşamada fiyat hesaplama, hakediş hesaplama veya SAP entegrasyonu
yapılmayacaktır.

------------------------------------------------------------------------

# 2. Temel Yaklaşım

Uygulama, mevcut kağıt formun dijital karşılığı olmalıdır.

Kağıt formdaki:

-   Alanlar
-   Bölümler
-   Tablolar
-   İmalat bilgileri
-   İşçilik bilgileri
-   Malzeme bilgileri
-   Üstyapı bilgileri
-   Kontrol/onay bilgileri

dijital forma aktarılmalıdır.

Ancak kağıt formun fiziksel sınırlamaları dijital ortamda devam
ettirilmemelidir.

Örneğin:

-   İşçilik satırları gerektiğinde artırılabilmeli.
-   Malzeme satırları gerektiğinde artırılabilmeli.
-   Fotoğraf eklenebilmeli.
-   Form mobil/tablet ekranında rahat kullanılabilmeli.
-   Klavye açıldığında alanlar ekran dışında kalmamalı.
-   Büyük butonlar ve dokunmatik kontroller kullanılmalı.

------------------------------------------------------------------------

# 3. Hedef Kullanım Cihazları

Uygulama öncelikli olarak:

1.  Tablet
2.  Cep telefonu
3.  Masaüstü bilgisayar

üzerinde çalışmalıdır.

## Mobil Öncelik

Tasarım **mobile-first** olmalıdır.

Özellikle saha personeli:

-   Telefon
-   8--11 inç tablet

kullanırken formu rahatlıkla doldurabilmelidir.

Arayüz masaüstü formunun küçültülmüş hali olmamalıdır.

------------------------------------------------------------------------

# 4. Ana Ekran Yapısı

Uygulama açıldığında sade bir ana ekran bulunmalıdır.

Önerilen yapı:

-   Yeni İmalat Formu
-   Kayıtlı Formlar
-   Taslak Formlar
-   Tamamlanan Formlar

İlk MVP'de kullanıcı yönetimi veya gelişmiş yetkilendirme zorunlu
değildir.

------------------------------------------------------------------------

# 5. Dijital İmalat Formu

Form, aşağıdaki ana bölümlerden oluşmalıdır:

1.  Genel Bilgiler
2.  Yapı / Altyapı Geçiş Bilgileri
3.  İmalat / Kroki Alanı
4.  İşçilik
5.  Bozulan Üstyapı
6.  Malzeme
7.  İmza / Kontrol
8.  Servis Hattı İmalat Kontrolü
9.  Fotoğraflar

------------------------------------------------------------------------

# 6. Genel Bilgiler

Kağıt formdaki üst bilgi bölümü dijital forma aktarılmalıdır.

Alanlar:

-   Tarih
-   Bölge
-   Sektör
-   İl
-   İlçe
-   Mahalle
-   Cadde / Sokak
-   Bina Adedi / No
-   Bağlantı Nesnesi
-   Telefon
-   Su
-   Atık Su
-   İnternet
-   Kablo TV
-   Doğalgaz
-   Diğer

Ayrıca kağıt formdaki ilgili durum bilgileri:

-   Alt Yapı Geçiş Bilgileri
-   Durum
-   Hasarlı
-   Hasarsız

gibi alanlar dijital karşılıklarına dönüştürülmelidir.

------------------------------------------------------------------------

# 7. İmalat / Kroki Alanı

Mevcut kağıt formda imalatın basit bir kroki üzerinde gösterildiği bölüm
bulunmaktadır.

Dijital sistemde bu bölüm korunmalıdır.

Kullanıcı:

-   Basit çizim yapabilmeli.
-   Nokta/işaret ekleyebilmeli.
-   Çizgi çizebilmeli.
-   Gerekirse ölçü yazabilmeli.
-   Çizimi temizleyebilmeli.
-   Geri alabilmeli.

İlk MVP için gelişmiş CAD/GIS sistemi gerekmemektedir.

Basit bir **dokunmatik çizim alanı / canvas** yeterlidir.

Tablet kullanımında kalem (stylus) desteği varsa çizim deneyimi buna
uygun tasarlanmalıdır.

------------------------------------------------------------------------

# 8. İşçilik Bölümü

Kağıt formdaki işçilik tablosu dijital olarak oluşturulmalıdır.

Alanlar:

-   İşçilik Adı
-   Miktar

Kullanıcı birden fazla işçilik satırı ekleyebilmelidir.

Örnek:

  İşçilik Adı      Miktar
  -------------- --------
  Boru montajı        9 m
  Kazı                9 m

Arayüzde:

**+ İşçilik Ekle**

butonu bulunmalıdır.

Her satır ayrı ayrı silinebilmeli ve düzenlenebilmelidir.

------------------------------------------------------------------------

# 9. Bozulan Üstyapı Bölümü

Bu bölüm mevcut formdaki yapıyı korumalıdır.

Alanlar:

-   Üstyapı Adı
-   Uzunluk
-   Genişlik

Örnek:

  Üstyapı Adı     Uzunluk   Genişlik
  ------------- --------- ----------
  Asfalt              9 m     0,60 m

Birden fazla üstyapı kaydı eklenebilmelidir.

Arayüzde:

**+ Üstyapı Ekle**

butonu bulunmalıdır.

------------------------------------------------------------------------

# 10. Malzeme Bölümü

Malzeme tablosu dijital sistemin önemli bölümlerinden biridir.

Alanlar:

-   No
-   Malzeme Adı
-   Miktar
-   Seri No
-   Ekipman No
-   Marka

Kullanıcı sınırsız sayıda malzeme satırı ekleyebilmelidir.

Önerilen kullanım:

**+ Malzeme Ekle**

Örnek:

    No Malzeme Adı     Miktar Seri No   Ekipman No   Marka
  ---- ------------- -------- --------- ------------ -------
     1 PE Boru            9 m XXXXX     \-           XXX
     2 Manşon          2 adet \-        \-           XXX

No alanı sistem tarafından otomatik oluşturulabilir.

------------------------------------------------------------------------

# 11. İmza ve Kontrol Bölümü

Kağıt formdaki alt bölüm dijital olarak korunmalıdır.

Alanlar:

-   Yüklenici
-   Kontrol
-   Dağıtım Şirketi / Teslim Alan

İlk MVP'de gerçek elektronik imza altyapısı zorunlu değildir.

Ancak sistem mimarisi ileride:

-   Parmakla imza
-   Stylus ile imza
-   Elektronik imza

eklenebilecek şekilde tasarlanmalıdır.

------------------------------------------------------------------------

# 12. Servis Hattı İmalat Kontrolü

Formun altında bulunan servis hattı kontrol alanları dijital checkbox
olarak tasarlanmalıdır.

Örneğin:

-   Test ve devreye alma işlemi gerçekleştirilmiştir.
-   İmalat, gazsız şebeke ile birlikte teste alınıp sonrasında
    gazlanacaktır.

Kullanıcı ilgili seçenekleri işaretleyebilmelidir.

------------------------------------------------------------------------

# 13. Fotoğraf Eklenmesi

Dijital formun kağıt forma göre önemli avantajlarından biri fotoğraf
eklenebilmesidir.

Form içerisinde:

**+ Fotoğraf Ekle**

butonu bulunmalıdır.

Kullanıcı:

-   Kameradan fotoğraf çekebilmeli.
-   Galeriden fotoğraf seçebilmeli.
-   Birden fazla fotoğraf ekleyebilmeli.
-   Fotoğrafı silebilmeli.

İlk MVP'de fotoğrafın otomatik GPS bilgisiyle ilişkilendirilmesi zorunlu
değildir ancak ileride eklenebilecek şekilde mimari düşünülmelidir.

------------------------------------------------------------------------

# 14. Form Durumları

Her formun bir durumu olmalıdır.

Önerilen durumlar:

-   Taslak
-   Tamamlandı
-   Kontrol Bekliyor
-   Onaylandı
-   Revizyon Bekliyor

İlk MVP'de sadece:

-   Taslak
-   Tamamlandı

yeterlidir.

İlerleyen aşamalarda kontrol/onay workflow'u eklenebilir.

------------------------------------------------------------------------

# 15. Kaydetme Mantığı

Saha kullanımında internet bağlantısı her zaman güvenilir olmayabilir.

Bu nedenle uygulama mümkün olduğunca **offline-first** düşünülmelidir.

En azından:

-   Form taslağı cihazda kaybolmamalı.
-   Kullanıcı yanlışlıkla sayfadan çıktığında veriler korunmalı.
-   İnternet kesildiğinde form doldurulmaya devam edebilmeli.
-   İnternet geldiğinde veriler sunucuya aktarılabilecek şekilde mimari
    kurulmalıdır.

İlk prototipte gerçek backend kullanılmasa bile bu mimariye uygun veri
modeli oluşturulmalıdır.

------------------------------------------------------------------------

# 16. Mobil UX Gereksinimleri

Saha kullanımına uygunluk en önemli kriterlerden biridir.

## Tasarım İlkeleri

-   Büyük dokunmatik alanlar
-   Büyük butonlar
-   Okunabilir yazı boyutları
-   Yeterli satır yüksekliği
-   Az sayıda gereksiz modal pencere
-   Form alanları arasında kolay geçiş
-   Sayfa içinde kaybolmayı önleyen bölüm başlıkları
-   Sticky "Kaydet" butonu
-   Hatalı girişlerde açık hata mesajları

Özellikle telefon ekranında yatay kaydırma mümkün olduğunca
azaltılmalıdır.

Tablolar mobilde gerekirse kart yapısına dönüşebilir.

Örneğin masaüstünde:

  Malzeme   Miktar   Seri No   Marka
  --------- -------- --------- -------

mobilde:

**Malzeme #1**

Malzeme Adı\
\[\_\_\_\_\_\_\_\_\]

Miktar\
\[\_\_\_\_\_\_\_\_\]

Seri No\
\[\_\_\_\_\_\_\_\_\]

Marka\
\[\_\_\_\_\_\_\_\_\]

şeklinde gösterilebilir.

------------------------------------------------------------------------

# 17. Form Kaydetme ve Listeleme

Ana ekranda kayıtlı formlar listelenmelidir.

Örnek:

  Tarih        Mahalle    Cadde/Sokak   Durum
  ------------ ---------- ------------- ------------
  05.10.2026   Liman      1234 Sokak    Taslak
  05.10.2026   Altınova   5678 Sokak    Tamamlandı

Kullanıcı bir kayda tıklayarak:

-   Görüntüleme
-   Düzenleme
-   Kopyalama
-   Silme

işlemlerini yapabilmelidir.

------------------------------------------------------------------------

# 18. Form Kopyalama

Sahada aynı veya benzer bölgelerde tekrar eden işler olabileceği için
ilerleyen aşamada:

**Formu Kopyala**

özelliği eklenebilir.

Bu özellik yeni form oluştururken:

-   Genel bilgilerin bir kısmını
-   İşçilik satırlarını
-   Malzeme yapısını

kopyalayabilir.

Ancak tarih ve değişmesi gereken bilgiler otomatik olarak
güncellenmelidir.

------------------------------------------------------------------------

# 19. Veri Modeli

İlk aşamada form verisi aşağıdaki temel yapıda düşünülebilir:

``` text
Form
├── id
├── tarih
├── bolge
├── sektor
├── il
├── ilce
├── mahalle
├── caddeSokak
├── binaBilgisi
├── baglantiNesnesi
├── altyapiBilgileri
├── kroki
├── iscilikler[]
├── ustYapilar[]
├── malzemeler[]
├── kontrol
├── imzalar
├── fotograflar[]
└── durum
```

Bu yapı ileride backend ve SAP entegrasyonu için genişletilebilir.

------------------------------------------------------------------------

# 20. İlk MVP'de Yapılmayacaklar

İlk versiyon gereksiz yere büyütülmemelidir.

Şunlar ilk MVP'de yapılmayacak:

-   SAP entegrasyonu
-   Hakediş hesaplama
-   Fiyat hesaplama
-   Birim fiyat yönetimi
-   Gelişmiş kullanıcı yetkilendirme
-   Gelişmiş GIS
-   Gelişmiş CAD
-   ERP entegrasyonu
-   Karmaşık raporlama
-   Gelişmiş elektronik imza altyapısı

Ama yazılım mimarisi ileride bunların eklenmesine uygun olmalıdır.

------------------------------------------------------------------------

# 21. Gelecek Aşamalarda Eklenebilecek Özellikler

İlk dijital form başarılı olduktan sonra sistem şu şekilde
geliştirilebilir:

### Aşama 2

-   Kullanıcı girişi
-   Yüklenici tanımlama
-   Kontrol personeli
-   Form onay süreci
-   Revizyon süreci

### Aşama 3

-   GPS konumu
-   Harita
-   İmalat lokasyonu
-   Fotoğraf metadata
-   GIS entegrasyonu

### Aşama 4

-   Raporlama
-   Excel/PDF çıktısı
-   Aylık form raporu
-   Yüklenici bazlı raporlar

### Aşama 5

-   SAP entegrasyonu
-   SAP'ye otomatik veri aktarımı

------------------------------------------------------------------------

# 22. Görsel Tasarım

Tasarım, kurumsal ve sade olmalıdır.

Mevcut Enerya kurumsal kimliğinden ilham alınabilir.

Ancak uygulama:

-   Aşırı renkli
-   Karmaşık
-   Dashboard ağırlıklı
-   Gereksiz animasyonlu

olmamalıdır.

Ana amaç:

> **Sahada hızlı, hatasız ve kolay veri girişi.**

------------------------------------------------------------------------

# 23. Kritik Tasarım Prensibi

Bu proje bir "dashboard projesi" değildir.

Bu proje öncelikle:

> **Saha veri toplama ve dijital imalat formu projesidir.**

Dolayısıyla başarı kriterleri:

1.  Saha personeli formu hızlı doldurabilmeli.
2.  Telefon/tablet üzerinde rahat kullanılabilmeli.
3.  Kağıt formdaki hiçbir önemli bilgi kaybolmamalı.
4.  İşçilik ve malzeme satırları dinamik olmalı.
5.  Form daha sonra tekrar açılabilmeli.
6.  Veri kaybı önlenmeli.
7.  İleride SAP entegrasyonuna uygun veri yapısı bulunmalı.

------------------------------------------------------------------------

# 24. AI İçin Geliştirme Talimatı

Bu projeyi geliştirirken aşağıdaki prensiplere uy:

-   Önce çalışan ve sade bir MVP oluştur.
-   Gereksiz özellikler ekleme.
-   Kağıt formdaki alanları eksiltme.
-   Mobil/tablet kullanımını masaüstünden daha önemli kabul et.
-   Responsive tasarım kullan.
-   Dokunmatik kullanım için uygun kontroller oluştur.
-   Form verilerini temiz ve yapılandırılmış şekilde sakla.
-   Dinamik tablo satırlarını destekle.
-   Fotoğraf eklemeyi destekle.
-   Kroki için touch-friendly canvas kullan.
-   Form verilerinin kaybolmasını engelle.
-   Kod yapısını ileride backend/SAP entegrasyonu eklenebilecek şekilde
    modüler oluştur.
-   Form tasarımını bileşenlere ayır.
-   Tekrarlanan kodlardan kaçın.
-   Kullanıcıya teknik hata yerine anlaşılır mesajlar göster.
-   Herhangi bir özelliği eklemeden önce bunun saha personelinin işini
    kolaylaştırıp kolaylaştırmadığını değerlendir.

------------------------------------------------------------------------

# 25. Başlangıç Hedefi

İlk çalışan prototip şu senaryoyu eksiksiz gerçekleştirmelidir:

``` text
Kullanıcı
   ↓
Yeni Form
   ↓
Genel bilgileri doldurur
   ↓
İmalat bilgilerini girer
   ↓
İşçilik ekler
   ↓
Üstyapı bilgilerini girer
   ↓
Malzeme ekler
   ↓
Kroki çizer
   ↓
Fotoğraf ekler
   ↓
Formu kaydeder
   ↓
Kayıtlı Formlar ekranında görür
   ↓
Formu tekrar açar
   ↓
Bilgileri düzenler
   ↓
Formu tamamlar
```

Bu akış ilk MVP'nin temel başarı kriteridir.

------------------------------------------------------------------------

# 26. Sonuç

Bu proje mevcut kağıt İmalat Formunun dijitalleştirilmesiyle başlayacak,
ancak ileride doğal gaz altyapı saha operasyonlarının tamamını
yönetebilecek bir platforma dönüşebilecek şekilde tasarlanmalıdır.

İlk hedef basittir:

> **Kağıt formu ortadan kaldırmak ve aynı bilgileri sahada
> telefon/tablet üzerinden hızlı ve güvenilir şekilde toplamak.**

Fiyat, hakediş ve SAP süreçleri ilk aşamada sistemin dışında
tutulacaktır.

Öncelik:

**Saha → Kolay Veri Girişi → Güvenli Kayıt → Dijital İmalat Formu**
