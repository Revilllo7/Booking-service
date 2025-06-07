# Booking Microservices Project

## Wymagania projektowe

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

## Elementy oceniane

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

## Podsumowanie technologii

- **Frontend:** React, TypeScript, Vite, Nginx
- **Backend:** Node.js, Express, Prisma, PostgreSQL, JWT
- **API Gateway:** Express, http-proxy-middleware, Redis (rate limiting)
- **Bazy danych:** PostgreSQL (osobne dla userów i bookingów)
- **Cache:** Redis
- **Docker:** Compose, multi-stage builds, healthchecks, wolumeny, sieć

---

## Uruchomienie

1. `docker-compose build`
2. `docker-compose up`

Aplikacja dostępna na `http://localhost:3000`

---

## TODO

- [ ] Zaimplementować endpoint dostępności slotów w booking-service i frontendzie
- [ ] Dodać wylogowanie i obsługę ról w UI
- [ ] Użyć Docker Secrets do zarządzania danymi wrażliwymi (Problem bez Docker Swarm)
- [x] Dodać hot reload dla wszystkich usług developerskich (opcjonalnie)
