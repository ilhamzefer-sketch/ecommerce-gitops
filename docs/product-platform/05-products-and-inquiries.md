# Məhsullar və müştəri sorğuları

## Məhsul lifecycle-ı

- `DRAFT`: yalnız shop üzvləri görür; natamam ola bilər.
- `PUBLISHED`: ictimai kataloqda görünür.
- `ARCHIVED`: ictimai kataloqdan çıxarılıb, tarixçə saxlanılır.

Yalnız `ACTIVE` mağazanın uyğun səlahiyyətli üzvü məhsul yarada, yeniləyə, yayımlaya və arxivləyə bilər. Shop statusu aktiv deyiləndə yeni publish və dəyişiklik bloklanır; artıq yayımlanmış məhsullar ictimai kataloqdan gizlədilir.

## Məhsul məlumatları

- shop ID
- ad, slug və təsvir
- kateqoriya
- qiymət göstəricisi və valyuta
- vəziyyət və stok qeydi
- əsas şəkil URL-i və əlavə şəkillər
- əlaqə/çatdırılma qeydi
- status və yaradılma/yenilənmə vaxtı

Qiymət məlumat xarakterlidir; platformada ödəniş əməliyyatı yaratmır.

## Sorğu

Autentifikasiya olunmuş alıcı yayımlanmış məhsul üçün satıcıya mesaj göndərə bilər. Sorğu alıcının user ID-sini, shop və product ID-ni, mesajı, üstün tutulan əlaqə kanalını və statusu saxlayır.

Sorğu statusları: `OPEN`, `RESPONDED`, `CLOSED`. Bu statuslar pulun ödənməsini və ya satışın hüquqi tamamlanmasını ifadə etmir.
