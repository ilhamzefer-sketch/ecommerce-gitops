# Frontend axını və dizayn sistemi

## Məhsul dili

İnterfeys Azərbaycan dilindədir. Mətn konkret və dürüstdür. “Mini satıcı”, “ödə”, “checkout”, “platformada satışı tamamla” terminləri işlədilmir.

Əsas marşrutlar:

- `/login`, `/register`
- `/choose-workspace`
- `/marketplace`, `/products/:slug`
- `/seller/apply`, `/seller/status`, `/seller`
- `/admin/shops`

## Rəng rolları

Palitra mənbəyi: [assets/color-palette.png](assets/color-palette.png)

| Token | Dəyər | Rol |
|---|---|---|
| Vapor | `#E2E4D7` | səhifə fonu |
| Sage | `#C1C5B6` | yumşaq səth və sərhəd |
| Current | `#76919B` | ikincil vurğu və məlumat |
| Current Ink | `#516B76` | kiçik vurğu mətnlərində əlçatan kontrast |
| Slate | `#6A7167` | ikincil mətn |
| Carbon | `#434942` | əsas komponent və tünd mətn |
| Depth | `#192120` | əsas mətn, header, yüksək kontrast |

Semantik success/warning/error rəngləri ayrıca, yüksək kontrastlı və məhdud işlədilir. Gradient, parıltı və dekorativ glass effektləri əsas dizayn dili deyil.

## UI keyfiyyət qaydaları

- body mətni ən azı 16px və 1.5 line-height
- form label-ları daim görünən və input-un üstündə
- klaviatura ilə tam idarə, görünən focus, semantik HTML
- mobil touch target praktik olaraq 44–48px
- desktop-u kiçiltmək yox, mobil üçün yenidən düzülmüş axın
- loading, empty, success, rejected, suspended və error vəziyyətləri
- reduced-motion dəstəyi
- real və dürüst məhsul şəkilləri; saxta rəy, satış rəqəmi və badge yoxdur
- LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 hədəfi

Vizual eskiz struktur ideyasıdır. Cari business statusları və CTA mətnləri bu sənəd dəstindən gəlir.

## Seçilmiş vizual istiqamət

Frontend “Calm Commerce” istiqamətindən istifadə edir:

- isti, premium retail görünüşü və düz səthlər
- tam enli header və sakit, aydın naviqasiya
- auth səhifələrində məhsul still-life fotosu ilə formanın yan-yana düzülməsi
- mobil auth axınında dekorativ medianın gizlədilməsi və formanın birbaşa göstərilməsi
- register formasında tək oxuma istiqaməti və məlumatların məntiqi qrupları
- ayırmaq üçün əvvəlcə spacing və divider, yalnız zəruri yerdə border
- əsas CTA üçün Depth, fokus və seçilmiş vəziyyət üçün Current

Seçilmiş mockup frontend layihəsində `design-reference/selected-option-2.png`, auth foto aktivi isə `public/assets/editorial/auth-still-life.jpg` faylındadır.
