# Mikroservis arxitekturası

## Servislər

| Servis | Məsuliyyət | Data ownership | Port |
|---|---|---|---:|
| API Gateway | vahid giriş, CORS, route və kənar JWT yoxlaması | yoxdur | 8080 |
| Auth Service | qeydiyyat, login, sessiya, user profili və sistem rolları | `ecommerce_auth` | 8081 |
| Shop Service | müraciət, status, üzvlük, admin qərarı və audit | `ecommerce_shop` | 8082 |
| Product Service | məhsul, kataloq və məhsul sorğuları | `ecommerce_product` | 8083 |
| Web UI | alıcı, satıcı və admin interfeysi | yoxdur | 3001 |

Servislər eyni Postgres instansiyasını lokal mühitdə paylaşa bilər, lakin ayrı schema və migration tarixçəsinə sahibdir. Servis başqa servisin cədvəlinə birbaşa qoşulmur.

## Kimlik ötürülməsi

Gateway bearer token-i yoxlayır və request-i dəyişmədən downstream servisə ötürür. Hər data sahibi servis token imzasını yenidən yoxlayır. `sub` stabil user ID, `username` göstərim adı, `roles` sistem rollarıdır.

Product Service satıcı əməliyyatında bearer token-i Shop Service-in daxili authorization endpoint-inə ötürür. Shop Service shop statusu, membership və tələb olunan əməliyyatı yoxlayır. Bu remote yoxlama Product Service transaction-ından əvvəl edilir.

## Əsas route-lar

- `/api/auth/**`, `/api/users/**` → Auth Service
- `/api/shops/**`, `/api/admin/shops/**` → Shop Service
- `/api/products/**`, `/api/inquiries/**` → Product Service

Admin qərarı Shop Service-ə məxsusdur. Auth-dakı admin dashboard yalnız platforma identity statusu verə bilər; shop cədvəlləri Auth-a əlavə edilmir.

GitOps manifestləri servis repolarının deploy şəklidir. `_sources` kodun əsas development mənbəyi deyil və servis reposu ilə eyni commit məzmunundan generasiya/sinxronlaşdırılmalıdır.
