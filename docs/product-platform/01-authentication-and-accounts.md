# Autentifikasiya və hesab qaydaları

## Tək hesab prinsipi

Bir insan üçün bir Mizan hesabı və bir login axını var. “Alıcı hesabı” və “satıcı hesabı” ayrıca credential deyil. İstifadəçi eyni login sessiyası ilə alıcı sahəsinə həmişə, mağazası uyğun vəziyyətdədirsə satıcı sahəsinə də keçə bilər.

## Qeydiyyat məlumatları

Qeydiyyat zamanı bunlar tələb olunur:

- `username`
- `email`
- `phoneNumber`
- `password`
- `firstName`
- `lastName`

`username`, kiçik hərfə çevrilmiş `email` və E.164 formasına normallaşdırılmış `phoneNumber` sistemdə təkrarlana bilməz. Şifrə yalnız təhlükəsiz hash kimi saxlanılır. Hər yeni istifadəçi `ROLE_USER` alır.

E-poçt və telefon ayrıca təsdiq vəziyyətinə malikdir. Telefon təsdiqləmə provayderi qoşulana qədər backend bu vəziyyəti və müqaviləni saxlayır; saxta “SMS göndərildi” iddiası UI-da göstərilmir.

## Login

Login bir formadır. İstifadəçi username, e-poçt və ya telefon nömrəsi ilə eyni `identifier` sahəsindən daxil ola bilər. Uğurlu login istifadəçini birbaşa alıcı və ya satıcı kimi autentifikasiya etmir; autentifikasiyadan sonra iş sahəsi seçilir.

Access token sabit istifadəçi ID-sini `sub` claim-də, username-i ayrıca `username` claim-də və sistem rollarını `roles` claim-də saxlayır. Shop membership və satıcı səviyyəsi JWT daxilində saxlanmır; həmin məlumat Shop Service-dən real vaxtda alınır.

## Rollar

- `ROLE_USER`: bütün qeydiyyatlı istifadəçilərin baza rolu.
- `ROLE_ADMIN`: platforma idarəetməsi və mağaza qərarları.

`ROLE_SELLER` yaradılmır. Satıcı səlahiyyəti aktiv mağazadakı üzvlük və shop rolu ilə müəyyən edilir.
