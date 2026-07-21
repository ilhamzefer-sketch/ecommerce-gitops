# Test və qəbul meyarları

## Auth

- qeydiyyat bütün məcburi sahələrlə uğurludur
- username, normallaşdırılmış email və telefon təkrarında `409`
- username/e-poçt/telefon ilə eyni login işləyir
- token-də stabil user ID, username və rollar var
- etibarsız credential, validation, refresh və logout testləri var

## Shop

- yeni müraciət draft və ya pending olur, heç vaxt birbaşa active olmur
- owner üçün bir mağaza limiti qorunur
- yalnız admin approve/reject/suspend/reactivate edir
- reject/suspend səbəbsiz qəbul edilmir
- hər qərar audit yaradır
- bütün seller entry statusları API müqaviləsində qaytarılır

## Product və sorğu

- yalnız aktiv shop üzvü create/update/publish edir
- draft ictimai kataloqda görünmür
- qeyri-aktiv shop məhsulları ictimai kataloqda görünmür
- alıcı yayımlanmış məhsula sorğu göndərə bilir
- payment/checkout endpoint-i yoxdur

## Frontend

- qeydiyyat, login, workspace seçimi, kataloq, shop müraciəti/statusu, seller paneli və admin approval brauzerdə test edilir
- 1440px desktop və 390px mobil vizual yoxlama
- klaviatura, focus, error və loading vəziyyətləri
- lint, typecheck, unit test və production build uğurludur
- dizayn QA hesabatı `design-qa.md` olaraq frontend repo kökündə `passed` nəticəsi ilə saxlanır

## Docker

`docker compose up --build` postgres, auth, shop, product, gateway və web UI servislərini health check-lərlə qaldırır. Əsas end-to-end ssenari real gateway üzərindən işləyir.
