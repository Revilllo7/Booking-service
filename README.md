# Booking Microservices Project

[Wymagania TECHNOLOGIE CHMUROWE](#wymagania-projektowe-technologie-chmurowe)
[Wymagania BEZPIECZEŃSTWO APLIKACJI WEB](#wymagania-projektowe-bezpieczeństwo-aplikacji-web)

## Wymagania projektowe TECHNOLOGIE CHMUROWE

Należy zaimplementować aplikację opartą na architekturze mikroserwisowej, składającą się z co najmniej trzech odrębnych, logicznie uzasadnionych usług (mikroserwisów). Przykładowe komponenty:

- Usługa frontendowa
- Usługa backendowa (API)
- Usługa dedykowana (np. obsługa logiki biznesowej)
- Baza danych (SQL/NoSQL)
- Pamięć podręczna (np. Redis)

Technologie implementacji są dowolne. Należy zadbać o poprawną komunikację między serwisami (np. REST, gRPC, komunikacja przez kolejkę).

---

## Technologie i architektura

- **Frontend:** React + TypeScript (Vite), serwowany przez Nginx
- **API Gateway:** Node.js + Express, reverse proxy, rate limiting (Redis)
- **Booking Service:** Node.js + Express + Prisma, PostgreSQL
- **User Service:** Node.js + Express, PostgreSQL, JWT autoryzacja
- **Bazy danych:** PostgreSQL (osobne dla użytkowników i rezerwacji)
- **Cache:** Redis (rate limiting)
- **Komunikacja:** REST (HTTP, JSON), proxy przez API Gateway

---

## Elementy oceniane Docker

> Ocenie podlega logiczny podział na mikroserwisy, spójność i poprawność zaimplementowanej komunikacji między nimi.

### Jakość Architektury (x / 8 pkt)

- Logiczny podział na mikroserwisy: frontend, api-gateway, booking-service, user-service, bazy danych, redis
- Spójna komunikacja REST przez API Gateway
- Oddzielne bazy danych dla różnych domen

> Wymagana jest poprawna składnia pliku docker-compose.yml.
> Należy zdefiniować wszystkie usługi aplikacji oraz zależności (depends_on).
> Wymagane jest efektywne zarządzanie konfiguracją (np. zmienne środowiskowe).

### Definicja Usług (docker-compose.yml) (x / 14 pkt)

- Poprawna składnia pliku [`docker-compose.yml`](docker-compose.yml)
- Wszystkie usługi i zależności (`depends_on`)
- Konfiguracja przez zmienne środowiskowe (np. `DATABASE_URL`)

- Healthcheck dla każdej usługi

### Sieci Docker (x / 6 pkt)

> Należy utworzyć i wykorzystać niestandardową sieć Docker.
> Wymagana jest poprawna konfiguracja komunikacji przez nazwy kontenerów.

- Niestandardowa sieć Docker (`app-network`)
- Komunikacja przez nazwy kontenerów (np. `user-service:3003`)

### Wolumeny Docker (x / 6 pkt)

> Należy skonfigurować wolumeny dla usług stanowych w celu zapewnienia trwałości danych.

- Wolumeny dla baz danych (`booking-db-data`, `user-db-data`)

### Optymalizacja Obrazów Docker (Dockerfile) (x / 11 pkt)

> Należy przygotować własne, poprawne pliki Dockerfile.
> Wymagane jest zastosowanie technik minimalizacji rozmiaru obrazu (multi-stage builds, itp.).
> Ocenie podlega efektywne wykorzystanie cache'u warstw oraz użycie .dockerignore.

- Własne pliki Dockerfile dla każdej usługi
- Multi-stage builds (frontend, booking-service)
- Użycie `.dockerignore` dla minimalizacji obrazu

### Multiplatformowość (x / 5 pkt)

> Należy zbudować obrazy wieloarchitekturowe (amd64, arm64) przy użyciu docker buildx lub podobnego mechanizmu.

Fragment `docker buildx imagetools inspect revilllo/booking-service:latest` by pokazać, że obraz jest wieloarchitekturowy
(Nie jest na windowsa, ponieważ to wymaga Kontenerów na Windowsie, co jest pay-to-win i jakby, nie lol. Go install GNU/Linux, enjoy your life)

```Dockerfile
Name:      docker.io/revilllo/booking-service:latest
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:653f4c06c04ad8cb86ba1a67276893e3c413f2e6e9bc36605c1ee4de4d23b17a

Manifests:
  Name:        docker.io/revilllo/booking-service:latest@sha256:cc6afda866797d542c823cda2a3136c8ec0d57ecc8c7d12c996d626ac3f3820f
  MediaType:   application/vnd.oci.image.manifest.v1+json
  Platform:    linux/amd64

  Name:        docker.io/revilllo/booking-service:latest@sha256:881f54c65da2665e3ecc4f72a556f5e926e7c6372877f9714b13f9965b533bb7
  MediaType:   application/vnd.oci.image.manifest.v1+json
  Platform:    linux/arm64
```

### Dodatkowe punkty

> Implementacja dyrektyw healthcheck w pliku docker-compose.yml. (+4 pkt)
> Wykorzystanie argumentów budowania (ARG) i zmiennych (ENV) w Dockerfile do parametryzacji. (+1 pkt)
> Zastosowanie Docker Secrets do zarządzania danymi wrażliwymi. (+3 pkt)
> Implementacja mechanizmu "live reload"/"hot reload" dla usług deweloperskich. (+2 pkt)

- Healthcheck w compose (+4 pkt)
- Zastosowanie ENV w Dockerfile (częściowo, np. DATABASE_URL)
- Hot reload dla developmentu (możliwe przez nodemon w api-gateway)

---

## Elementy oceniane Kubernetes

### Manifesty Zasobów Kubernetes (`Deployment`, `Service`, `ConfigMap`, `Secret`): (x /19 pkt)

> Należy przygotować poprawne manifesty YAML.
> Wymagana jest poprawna konfiguracja selektorów, etykiet, portów.
> Ocenie podlega bezpieczne zarządzanie sekretami i konfiguracją.

- [placeholder]

### Trwałe Przechowywanie Danych (PV/PVC): (x / 9 pkt)

> Wymagana jest poprawna definicja PersistentVolumeClaim.
> Należy użyć StorageClass (jeśli dostępne) lub zdefiniować PersistentVolume.
> Ocenie podlega poprawne podmontowanie wolumenów w Podach.

- [placeholder]

### Ruch Zewnętrzny (Ingress / LoadBalancer): (x / 9 pkt)

> Należy skonfigurować dostęp do aplikacji z zewnątrz za pomocą Ingress lub Service typu LoadBalancer.
> Wymagana jest poprawna konfiguracja reguł routingu lub ekspozycji portów.

- [placeholder]

### Skalowanie Aplikacji (Replicas + HPA): (x / 13 pkt)

> Należy ustawić odpowiednią liczbę replik (replicas) w Deployment.
> Wymagane jest skonfigurowanie działającego HorizontalPodAutoscaler (HPA) dla co najmniej jednej usługi (wymaga Metrics Server).

- [placeholder]

### Dodatkowe punkty

> Monitoring: Wdrożenie Prometheus + Grafana, konfiguracja ServiceMonitor/adnotacji, stworzenie prostego dashboardu. (+4 pkt)
> Helm: Spakowanie aplikacji jako Helm Chart. (+3 pkt)
> CI/CD: Zaimplementowanie prostego potoku CI/CD (np. GitHub Actions) do automatycznego budowania obrazów i pushowania do repozytorium kontenerów. (+3 pkt)

- [placeholder]

---

## Podsumowanie technologii

- **Frontend:** React, TypeScript, Vite, Nginx
- **Backend:** Node.js, Express, Prisma, PostgreSQL, JWT
- **API Gateway:** Express, http-proxy-middleware, Redis (rate limiting)
- **Bazy danych:** PostgreSQL (osobne dla userów i bookingów)
- **Cache:** Redis
- **Docker:** Compose, multi-stage builds, healthchecks, wolumeny, sieć

---

## Uruchomienie

1. Clone the repo, go into directory
2. Have docker open
3. run in the terminal `docker-compose up --build`
4. Aplikacja dostępna na `http://localhost:3000`

---

That's the end for Docker and Kubernetes project </3

---

## Wymagania projektowe BEZPIECZEŃSTWO APLIKACJI WEB

> Celem projektu jest zabezpieczenie FE oraz przynajmniej jednego API używając standardu OAuth 2.0. Mogą to być niezależne aplikacje..

## Elementy oceniane

- Projekt (FE, API, IdP) działa x/5
- projekt działa w kubernetes x/4
- Projekt jest dodany do projektu Technologii chmurowych 3/3
- FE jest zabezpieczony x/4
  - wymaga logowania przez keycloak
- FE ma oddzielny panel admina niedostępny dla zwykłych użytkowników x/2
  - `/admin` route niedostępna dla zwykłych użytkowników
- Przynajmniej jedno API jest zabezpieczone niezależnie od FE lub FE sam się autoryzuje do naszego BE x/4
  - API jest zabezpieczone przez JWT
- Więcej niż jedno API jest zabezpieczone x/1
  - `booking-service` i `user-service` są zabezpieczone
- API zwraca różne wartości w zależności od roli użytkownika x/2
  - Admin widzi wszystkie rezerwacje, użytkownik widzi (i ma dostęp) tylko do swoich własnych
- Zabezpieczenie zostało poprawnie zaprezentowane (mogę poprosić o wytłumaczenie flow) x/2
- Czystość kodu i repozytorium x/2
- PKCE x/1

Suma : x/30

Dodatkowe:

- Aplikacje napisane w innym języku niż JS/TS (np. java, rust) 0/4
- Dodanie zabezpieczenia do projektu z zeszłego semestru (lub innego swojego większego projektu) 0/4
- FE korzysta ze stworzonego API 4/4

## Uruchomienie

1. Clone the repo, go into the directory
2. Have Docker open
3. run `docker-compose up --build`
4. open the app `http://localhost:3000`

### In case Keycloak doesn't work (It's mounted as a volume, so it should work, this is just in case)

1. go to `http://localhost:8080/admin/master/console/`
2. login `admin` password `admin`
3. create `booking-app` realm
4. create client for the realm:

- Client ID: `frontend`
- Root URL `http://booking.local`
- Valid redirect URIs `http://booking.local/*`
- Web origins `http://booking.local`

5. create roles for the client:

- admin
- user

6. create a mapper for the client:
   `Client frontend` -> `Client scopes` -> `frontend-dedicated` -> `Add mapper` -> `By configuration` -> `Add specified audience to the audience (aud) field of token`:
   name: `frontend-audience`
   Add to ID token: `ON`
   Add to access token: `ON`
7. create at least two users: `admin` and for example `testuser`

- set their credentials in `Credentials`
- go to `Role mapping` -> `Assign role` -> `Filter by clients` -> add correct role

8. go to `http://booking.local` and login as one of the users you just created
