# Mizan platform qaydaları

Bu qovluq Mizan e-commerce platformasının məhsul, texniki və dizayn qərarları üçün əsas mənbədir. Kodda dəyişiklik etməzdən əvvəl bu faylı və dəyişdiriləcək sahəyə uyğun sənədi oxu.

## Haradan oxumalı

| Mövzu | Əsas sənəd |
|---|---|
| Qeydiyyat, login, JWT və istifadəçi məlumatları | [01-authentication-and-accounts.md](01-authentication-and-accounts.md) |
| Login sonrası alıcı/satıcı keçidi | [02-workspace-entry-flow.md](02-workspace-entry-flow.md) |
| Mağaza müraciəti, admin təsdiqi və statuslar | [03-shop-onboarding-and-approval.md](03-shop-onboarding-and-approval.md) |
| Ödənişsiz marketplace və alıcı-satıcı razılaşması | [04-marketplace-without-payments.md](04-marketplace-without-payments.md) |
| Məhsul və müştəri sorğusu qaydaları | [05-products-and-inquiries.md](05-products-and-inquiries.md) |
| Mikroservis sərhədləri və API məsuliyyətləri | [06-service-architecture.md](06-service-architecture.md) |
| Frontend axını, terminologiya və rəng sistemi | [07-frontend-design-system.md](07-frontend-design-system.md) |
| Test və təhvil meyarları | [08-testing-and-acceptance.md](08-testing-and-acceptance.md) |

## Yeni qərarı hara yazmalı

- İstifadəçi kimliyi, telefon/e-poçt və giriş qaydaları `01` sənədinə yazılır.
- Login sonrası seçim və route davranışı `02` sənədinə yazılır.
- Satıcı qeydiyyatı, mağaza statusları və admin qərarları `03` sənədinə yazılır.
- Pul, ödəniş, çatdırılma və tərəflərin razılaşması `04` sənədinə yazılır.
- Məhsul lifecycle-ı, kataloq və sorğular `05` sənədinə yazılır.
- Servis sərhədi, data ownership, port və inteqrasiya `06` sənədinə yazılır.
- UI copy, komponent, responsive və rəng qərarları `07` sənədinə yazılır.
- Yeni test ssenarisi və qəbul şərti `08` sənədinə yazılır.

Yeni qaydanı təkrarlanan şəkildə bir neçə fayla yayma. Əsas sənədə yaz, lazım olan başqa sənəddə ona link ver. Qərar kodla ziddiyyət təşkil edirsə, əvvəl sənədi yenilə, sonra kodu və testləri eyni dəyişiklikdə uyğunlaşdır.

## Vizual mənbələr

- Rəng palitrası: [assets/color-palette.png](assets/color-palette.png)
- İlkin istifadəçi axını eskizi: [assets/account-flow-reference.png](assets/account-flow-reference.png)

Eskizdəki “Mini Satıcı” anlayışı köhnədir və tətbiq edilmir. Eskiz yalnız login sonrası seçim, alıcı kataloqu və satıcı panelinin ümumi əlaqəsini göstərir. Cari mətn və status qaydaları bu qovluqdakı sənədlərdən götürülür.

## Qərar üstünlüyü

1. İstifadəçinin son açıq qərarı.
2. Bu qovluqdakı sənədlər.
3. API testləri və servis müqavilələri.
4. Köhnə kod, GitOps `_sources` surətləri və vizual eskizlər.

GitOps `_sources` qovluğu biznes qərarlarının mənbəyi deyil; deploy üçün sinxronlaşdırılmış kod surətidir.
