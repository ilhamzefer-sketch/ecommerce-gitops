# Mağaza müraciəti və admin təsdiqi

## Model

MVP-də `Mini Shop` yoxdur. Bir `Shop` modeli var. Satış həcminə əsaslanan gələcək `STARTER`, `GROWTH`, `PRO` səviyyələri ayrıca identity və login deyil, capability tier olacaq.

İlk buraxılışda istifadəçi yalnız bir mağazanın sahibi ola bilər. Gələcəkdə çox mağaza ehtiyacı təsdiqlənərsə bu məhdudiyyət ayrıca qərarla dəyişdirilir.

## Müraciət məlumatları

- mağaza adı və unikal slug
- hüquqi tip: `INDIVIDUAL` və ya `BUSINESS`
- təsvir
- əlaqə telefonu və e-poçtu
- ünvan və şəhər
- kateqoriya
- VÖEN/şirkət adı kimi hüquqi məlumatlar yalnız `BUSINESS` üçün
- qaydalarla razılaşma vaxtı

Müraciət draft kimi saxlanıla bilər. Tələb olunan məlumatlar tamamlandıqdan sonra istifadəçi onu baxışa göndərir.

## Status lifecycle

```text
DRAFT -> PENDING_REVIEW -> ACTIVE
                     \-> REJECTED -> DRAFT -> PENDING_REVIEW
ACTIVE <-> SUSPENDED
ACTIVE -> CLOSED
```

Mağaza heç vaxt yaradılan anda `ACTIVE` olmur. Yalnız `ROLE_ADMIN` müraciəti təsdiqləyə, rədd edə, dayandıra və yenidən aktivləşdirə bilər.

Rədd və dayandırma zamanı səbəb məcburidir. Hər admin qərarı audit tarixçəsinə yazılır: admin user ID, shop ID, köhnə status, yeni status, səbəb və vaxt.

## Üzvlük

Shop credential sahibi deyil. İstifadəçilər shop üzvü olur:

- `OWNER`
- `MANAGER`
- `LISTING_MANAGER`
- `STAFF`

Məhsul yaratmaq və dəyişmək üçün aktiv shop üzvlüyü və uyğun icazə tələb olunur. MVP UI yalnız owner axınını tam göstərir; backend modeli gələcək komanda üzvlüyünü bloklamır.
