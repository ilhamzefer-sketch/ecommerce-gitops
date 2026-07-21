# Login sonrası iş sahəsi seçimi

Uğurlu login-dən sonra istifadəçi `/choose-workspace` səhifəsinə gəlir.

## Alıcı kartı

Alıcı kartı hər istifadəçiyə həmişə göstərilir.

- Başlıq: `Alış-veriş edin`
- İzah: `Məhsulları kəşf edin, satıcıya sorğu göndərin.`
- Əsas əməl: `Kataloqa keç`

## Satıcı kartı

Satıcı kartının mətni Shop Service-in qaytardığı cari vəziyyətə görə dəyişir:

| Vəziyyət | Başlıq | Əsas əməl |
|---|---|---|
| Mağaza yoxdur | `Satıcı olun` | `Mağaza yarat` |
| `DRAFT` | `Müraciəti tamamlayın` | `Davam et` |
| `PENDING_REVIEW` | `Müraciət yoxlanılır` | `Statusa bax` |
| `ACTIVE` | `Satıcı paneli` | `Panelə keç` |
| `REJECTED` | `Müraciətə düzəliş lazımdır` | `Səbəbə bax və yenilə` |
| `SUSPENDED` | `Mağaza dayandırılıb` | `Statusa bax` |
| `CLOSED` | `Mağaza bağlanıb` | `Məlumata bax` |

`PENDING_REVIEW`, `REJECTED`, `SUSPENDED` və `CLOSED` vəziyyətində satıcı idarəetmə funksiyaları açılmır. Admin olan istifadəçiyə ayrıca `İdarəetmə paneli` girişi göstərilir.

Seçilən iş sahəsi credential və ya server rolu deyil; frontend naviqasiya kontekstidir. İstifadəçi sonradan başlıq menyusundan sahələr arasında keçə bilər.
