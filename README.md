#  Projet Microservices - Application E-Commerce

## Table des matières

1. [Introduction](#introduction)
2. [Architecture du projet](#architecture-du-projet)
3. [Technologies utilisées](#technologies-utilisées)
4. [Backend - Microservices Spring Boot](#backend---microservices-spring-boot)
5. [Frontend - Application React](#frontend---application-react)
6. [Sécurité - Keycloak OAuth2](#sécurité---keycloak-oauth2)
7. [Bases de données PostgreSQL](#bases-de-données-postgresql)
8. [Conteneurisation Docker](#conteneurisation-docker)
9. [Installation et déploiement](#installation-et-déploiement)
10. [Captures d'écran](#captures-décran)
11. [Difficultés rencontrées](#difficultés-rencontrées)
12. [Améliorations futures](#améliorations-futures)

---

##  Introduction

Ce projet consiste en une **application web e-commerce moderne** basée sur une **architecture microservices**. L'application permet la gestion des produits et des commandes avec une authentification sécurisée via **Keycloak (OAuth2/OpenID Connect)**.

### Objectifs du projet

- 1 Concevoir une architecture microservices scalable
- 2 Implémenter une sécurité robuste avec OAuth2
- 3 Assurer l'isolation des données avec des bases PostgreSQL distinctes
- 4 Conteneuriser l'ensemble de la plateforme avec Docker
- 5 Développer une interface utilisateur moderne et responsive

---

##  Architecture du projet

L'architecture suit le pattern microservices avec les composants suivants :
```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend React (Port 3000)                   │
│                         Interface Utilisateur                     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  API Gateway (Port 8084)                         │
│              Point d'entrée unique + Routage                     │
│              Validation JWT + Autorisation                       │
└──────────────┬───────────────────────────────────┬──────────────┘
               │                                   │
               ▼                                   ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│  Service Produit (8081)  │         │ Service Commande (8082)  │
│  - CRUD Produits         │◄────────┤  - Création commandes    │
│  - Gestion stock         │         │  - Consultation          │
│  - PostgreSQL (5432)     │         │  - PostgreSQL (5433)     │
└──────────────────────────┘         └──────────────────────────┘
               │                                   │
               └───────────────┬───────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │  Keycloak (8080)    │
                    │  Authentification   │
                    │  Gestion des rôles  │
                    └─────────────────────┘
```

### Principes architecturaux

- **Séparation des préoccupations** : Chaque microservice a une responsabilité unique
- **Base de données par service** : Isolation complète des données
- **Communication REST** : API RESTful entre services
- **Single Point of Entry** : Tout passe par l'API Gateway
- **Stateless** : Services sans état pour faciliter la scalabilité

---

##  Technologies utilisées

### Backend

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **Java** | 17 | Langage principal |
| **Spring Boot** | 4.0.1 | Framework backend |
| **Spring Cloud Gateway** |  | API Gateway |
| **Spring Security OAuth2** | 3.2.1 | Sécurité JWT |
| **Spring Data JPA** | 3.2.1 | Persistance des données |
| **PostgreSQL** | 15 | Base de données |
| **Maven** | 3.9 | Gestion des dépendances |
| **Lombok** | - | Réduction du code boilerplate |

### Frontend

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **React** | 18.2.0 | Framework UI |
| **Tailwind CSS** | 3.3.0 | Framework CSS |
| **Axios** | 1.6.0 | Client HTTP |
| **Lucide React** | 0.263.1 | Icônes |
| **Node.js** | 18 | Runtime JavaScript |

### Infrastructure

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **Docker** | 24+ | Conteneurisation |
| **Docker Compose** | 3.8 | Orchestration |
| **Keycloak** | 24.0.1 | Serveur d'authentification |
| **Nginx** | Alpine | Serveur web frontend |

---

##  Backend - Microservices Spring Boot

### 1️⃣ Service Produit

Le **Service Produit** gère le catalogue des produits de l'application.

#### Fonctionnalités

- 1 **CRUD complet** : Créer, lire, modifier, supprimer des produits
- 2 **Gestion du stock** : Suivi des quantités disponibles
- 3 **Autorisation par rôles** : Seuls les ADMIN peuvent modifier

#### Modèle de données
```java
@Entity
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String description;
    private double prix;
    private int stock;
}
```

#### Endpoints API

| Méthode | Endpoint | Rôle requis | Description |
|---------|----------|-------------|-------------|
| `POST` | `/api/produits` | ADMIN | Créer un produit |
| `PUT` | `/api/produits/{id}` | ADMIN | Modifier un produit |
| `DELETE` | `/api/produits/{id}` | ADMIN | Supprimer un produit |
| `GET` | `/api/produits` | ADMIN, CLIENT | Lister les produits |
| `GET` | `/api/produits/{id}` | ADMIN, CLIENT | Consulter un produit |

#### Configuration

**Base de données** : PostgreSQL dédiée (`produitdb`)
- Port : 5432
- Utilisateur : `produit_user`
- Mot de passe : `produit_pass_2024`

**Sécurité** :
- Validation JWT via Keycloak
- Extraction des rôles depuis `realm_access.roles`
- Autorisation via `@PreAuthorize`

#### Screenshot - Service Produit

<img width="685" height="672" alt="image" src="https://github.com/user-attachments/assets/f3ff624f-f632-4ec2-b77e-6cd45edb38db" />
*Architecture et flux du Service Produit*

---

### 2️ Service Commande

Le **Service Commande** gère les commandes des clients.

#### Fonctionnalités

- 1 **Création de commandes** : Les clients peuvent créer des commandes
- 2 **Validation du stock** : Vérification automatique de la disponibilité
- 3 **Calcul du montant** : Calcul automatique du total
- 4 **Communication inter-services** : Appel au Service Produit via WebClient
- 5 **Consultation** : Les clients voient leurs commandes, les ADMIN voient tout

#### Modèle de données
```java
@Entity
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String userId;  // ID Keycloak
    private LocalDate dateCommande;
    private String statut;
    private double montantTotal;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<LigneCommande> lignes;
}

@Entity
public class LigneCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long idProduit;
    private int quantite;
    private double prix;
}
```

#### Endpoints API

| Méthode | Endpoint | Rôle requis | Description |
|---------|----------|-------------|-------------|
| `POST` | `/api/commandes` | CLIENT | Créer une commande |
| `GET` | `/api/commandes/mes-commandes` | CLIENT | Consulter ses commandes |
| `GET` | `/api/commandes` | ADMIN | Lister toutes les commandes |
| `GET` | `/api/commandes/{id}` | ADMIN, CLIENT | Consulter une commande |

#### Configuration

**Base de données** : PostgreSQL dédiée (`commandedb`)
- Port : 5433
- Utilisateur : `commande_user`
- Mot de passe : `commande_pass_2024`

**Communication inter-services** :
- WebClient pour appeler le Service Produit
- Propagation du token JWT dans les en-têtes
- Gestion des erreurs (stock insuffisant, produit inexistant)

#### Screenshot - Service Commande

<img width="693" height="723" alt="image" src="https://github.com/user-attachments/assets/bfedaf93-f6c5-41f0-8169-09254fba4a20" />
*Architecture et flux du Service Commande*



---

### 3️ API Gateway

L'**API Gateway** est le point d'entrée unique de l'application.

#### Responsabilités

- ✅ **Routage** : Redirection des requêtes vers les microservices
- ✅ **Validation JWT** : Vérification des tokens avant transmission
- ✅ **Autorisation** : Contrôle des rôles
- ✅ **CORS** : Gestion des requêtes cross-origin
- ✅ **Point d'entrée unique** : Sécurise l'accès aux microservices

#### Configuration des routes
```properties
# Route vers Service Produit
spring.cloud.gateway.routes[0].id=produit-service
spring.cloud.gateway.routes[0].uri=http://produit-service:8081
spring.cloud.gateway.routes[0].predicates[0]=Path=/api/produits/**

# Route vers Service Commande
spring.cloud.gateway.routes[1].id=commande-service
spring.cloud.gateway.routes[1].uri=http://commande-service:8082
spring.cloud.gateway.routes[1].predicates[0]=Path=/api/commandes/**
```

#### Sécurité Gateway
```java
@Configuration
public class GatewaySecurityConfig {
    
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeExchange(auth -> auth
                .pathMatchers("/api/produits/**").hasAnyRole("CLIENT", "ADMIN")
                .pathMatchers("/api/commandes/**").hasAnyRole("CLIENT", "ADMIN")
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );
        return http.build();
    }
}
```

##  Frontend - Application React

Le **frontend** est une application **React 18** moderne avec **Tailwind CSS**.

### Architecture Frontend
```
frontend-react/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx          # Page de connexion
│   │   ├── layout/
│   │   │   ├── Header.jsx             # En-tête avec navigation
│   │   │   └── Layout.jsx             # Layout principal
│   │   ├── produits/
│   │   │   ├── ProduitCard.jsx        # Carte produit
│   │   │   ├── ProduitForm.jsx        # Formulaire CRUD
│   │   │   └── ProduitsList.jsx       # Liste des produits
│   │   └── commandes/
│   │       ├── CommandeCard.jsx       # Carte commande
│   │       ├── CommandeForm.jsx       # Création commande
│   │       ├── Panier.jsx             # Panier d'achat
│   │       └── CommandesList.jsx      # Liste des commandes
│   ├── context/
│   │   └── AuthContext.jsx            # Gestion authentification
│   ├── services/
│   │   ├── api.js                     # Configuration Axios
│   │   ├── authService.js             # Service auth Keycloak
│   │   ├── produitService.js          # API produits
│   │   └── commandeService.js         # API commandes
│   ├── pages/
│   │   ├── ProduitsPage.jsx           # Page produits
│   │   └── CommandesPage.jsx          # Page commandes
│   ├── utils/
│   │   └── constants.js               # Constantes (URLs, etc.)
│   ├── App.jsx                        # Composant principal
│   └── index.js                       # Point d'entrée
```

### Fonctionnalités principales

#### 1. Authentification Keycloak
```javascript
// Connexion avec Keycloak via OAuth2
const login = async (username, password) => {
  const response = await fetch(
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'password',
        username,
        password
      })
    }
  );
  
  const { access_token } = await response.json();
  // Stocker le token
  localStorage.setItem('token', access_token);
};
```

#### 2. Gestion des produits

**Pour les ADMIN** :
-  Ajouter un produit
-  Modifier un produit
-  Supprimer un produit

**Pour tous** :
-  Consulter le catalogue
-  Voir les détails d'un produit

#### 3. Gestion des commandes

**Pour les CLIENT** :
-  Créer une commande via un panier
-  Ajouter/retirer des produits
-  Consulter ses commandes

**Pour les ADMIN** :
-  Consulter toutes les commandes
-  Voir les détails de chaque commande

### Interface utilisateur

-  **Design moderne** avec Tailwind CSS
-  **Responsive** : Fonctionne sur mobile, tablette, desktop
-  **Icônes** avec Lucide React
-  **Feedback utilisateur** : Loading, erreurs, succès
-  **Navigation intuitive** entre produits et commandes

### Screenshot - Frontend

<img width="1481" height="1012" alt="image" src="https://github.com/user-attachments/assets/601dfd18-a961-48fa-a2ab-71bd33fef179" />
*Page de connexion avec Keycloak*

<img width="1600" height="920" alt="image" src="https://github.com/user-attachments/assets/d6322544-25bc-46ff-bf60-f640a055357d" />
*Catalogue des produits*

<img width="1600" height="907" alt="image" src="https://github.com/user-attachments/assets/ed26e0d1-2da8-40a7-b999-a4c2a9a05d3b" />
*Interface d'administration des produits*
<img width="635" height="333" alt="image" src="https://github.com/user-attachments/assets/4c48f410-fc14-42c9-98a3-7998b3e0fce5" />
* ajout du produit avec succees*

<img width="1600" height="685" alt="image" src="https://github.com/user-attachments/assets/c65b9bb0-f646-4b07-825f-2cfeb02cf50e" />

<img width="1557" height="570" alt="image" src="https://github.com/user-attachments/assets/38698036-8a67-4104-a8fa-d7ee19e79bee" />
*Création d'une commande avec panier*

<img width="888" height="445" alt="image" src="https://github.com/user-attachments/assets/73155a51-fbfd-48c0-8fbd-bc38c013d8c2" />
*Liste des commandes d'un client*

---

##  Sécurité - Keycloak OAuth2

**Keycloak** est utilisé comme serveur d'authentification et d'autorisation.

### Configuration Keycloak

#### Realm : `microservices-realm`

**Paramètres** :
- SSL requis : None (dev)
- Inscription : Désactivée
- Login avec email : Activé

#### Rôles

| Rôle | Description | Permissions |
|------|-------------|-------------|
| **ADMIN** | Administrateur | Accès complet (CRUD produits + consultation commandes) |
| **CLIENT** | Client standard | Consultation produits + création/consultation commandes |

#### Client : `microservices-client`

**Configuration** :
- Type : Public (pas de secret)
- Direct Access Grants : Activé (pour login avec username/password)
- Standard Flow : Activé
- Valid Redirect URIs : `http://localhost:3000/*`, `http://localhost:8084/*`
- Web Origins : `http://localhost:3000`, `http://localhost:8084`, `+`

#### Utilisateurs de test

| Username | Mot de passe | Rôles |
|----------|--------------|-------|
| `admin` | `admin123` | ADMIN, CLIENT |
| `client1` | `client123` | CLIENT |

### Flux d'authentification
```
1. L'utilisateur saisit ses identifiants dans React
                    │
                    ▼
2. React envoie une requête POST à Keycloak
   POST /realms/microservices-realm/protocol/openid-connect/token
                    │
                    ▼
3. Keycloak valide les credentials et retourne un JWT
   { "access_token": "eyJhbGc..." }
                    │
                    ▼
4. React stocke le token dans localStorage
                    │
                    ▼
5. Chaque requête API inclut le token dans l'en-tête
   Authorization: Bearer eyJhbGc...
                    │
                    ▼
6. API Gateway valide le JWT avec Keycloak
                    │
                    ▼
7. Microservices extraient les rôles et autorisent
```

### Structure du JWT
```json
{
  "exp": 1736554800,
  "iat": 1736551200,
  "jti": "abc123",
  "iss": "http://keycloak:8080/realms/microservices-realm",
  "sub": "user-uuid",
  "typ": "Bearer",
  "preferred_username": "admin",
  "email": "admin@example.com",
  "realm_access": {
    "roles": ["ADMIN", "CLIENT"]
  }
}
```

### Extraction des rôles côté backend
```java
@Bean
public JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = 
        new JwtGrantedAuthoritiesConverter();
    
    // Extraire depuis realm_access.roles
    grantedAuthoritiesConverter.setAuthoritiesClaimName("realm_access.roles");
    
    // Préfixer avec ROLE_
    grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
    
    JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
    return converter;
}
```

### Screenshot - Keycloak

<img width="1342" height="850" alt="image" src="https://github.com/user-attachments/assets/9cdec8bb-8170-4031-a9ce-db18f01b1318" />
* acces a linterface keycloak pour gerer les differents utilisateurs *

---

##  Bases de données PostgreSQL

Chaque microservice possède sa **propre base de données PostgreSQL** pour garantir l'isolation.

### Principe d'isolation

-  **Aucun partage** : Chaque service a sa DB
-  **Comptes distincts** : Utilisateurs et mots de passe différents
-  **Ports différents** : 5432 et 5433
-  **Volumes Docker** : Persistance des données

### Base Produit
```yaml
produit-db:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: produitdb
    POSTGRES_USER: produit_user
    POSTGRES_PASSWORD: produit_pass_2024
  ports:
    - "5432:5432"
  volumes:
    - produit_data:/var/lib/postgresql/data
```

**Tables** :
- `produit` : id, nom, description, prix, stock

### Base Commande
```yaml
commande-db:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: commandedb
    POSTGRES_USER: commande_user
    POSTGRES_PASSWORD: commande_pass_2024
  ports:
    - "5433:5432"
  volumes:
    - commande_data:/var/lib/postgresql/data
```

**Tables** :
- `commande` : id, user_id, date_commande, statut, montant_total
- `ligne_commande` : id, commande_id, id_produit, quantite, prix



##  Conteneurisation Docker

Toute l'application est **conteneurisée avec Docker** pour faciliter le déploiement.

### Architecture Docker
```
docker-compose.yml
├── produit-db (PostgreSQL)
├── commande-db (PostgreSQL)
├── keycloak (Keycloak 24.0.1)
├── produit-service (Spring Boot + Maven)
├── commande-service (Spring Boot + Maven)
├── gateway-service (Spring Cloud Gateway)
└── frontend (React + Nginx)
```

### Dockerfiles

#### Service Spring Boot (exemple)
```dockerfile
# Étape 1: Build avec Maven
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Étape 2: Image finale légère
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Frontend React
```dockerfile
# Étape 1: Build React
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2: Servir avec Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  produit-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: produitdb
      POSTGRES_USER: produit_user
      POSTGRES_PASSWORD: produit_pass_2024
    ports:
      - "5432:5432"
    volumes:
      - produit_data:/var/lib/postgresql/data

  produit-service:
    build: ./produit-service
    environment:
      SPRING_PROFILES_ACTIVE: docker
    ports:
      - "8081:8081"
    depends_on:
      - produit-db
      - keycloak

  # ... autres services

volumes:
  produit_data:
  commande_data:
```

### Avantages de Docker

-  **Isolation** : Chaque service dans son conteneur
-  **Portabilité** : Fonctionne partout (dev, prod)
-  **Reproductibilité** : Même environnement pour tous
-  **Scalabilité** : Facilite la mise à l'échelle
-  **Orchestration** : Démarrage automatique dans le bon ordre

### Screenshot - Docker

<img width="1556" height="593" alt="image" src="https://github.com/user-attachments/assets/e2589944-c46c-44a6-9b58-8480c29ef8ae" />
*Liste des conteneurs Docker en cours d'exécution*

---

##  Installation et déploiement

### Prérequis

-  **Java 17** ou supérieur
-  **Maven 3.9** ou supérieur
-  **Node.js 18** ou supérieur
-  **Docker** et **Docker Compose**
-  **Git**

### Étape 1 : Cloner le projet
```bash
git clone https://github.com/nouracherrad/D-veloppement-d-une-application-micro-services-s-curis-e-Spring-Boot-React-Keycloak-.git
cd projet-microservices
```

### Étape 2 : Configuration Keycloak

1. Démarrer Keycloak :
```bash
docker-compose up -d keycloak
```

2. Accéder à http://localhost:8080
3. Se connecter : `admin` / `admin`
4. Importer le realm ou configurer manuellement (voir section Keycloak)

### Étape 3 : Démarrage avec Docker Compose
```bash
# Build et démarrage de tous les services
docker-compose up --build -d

# Suivre les logs
docker-compose logs -f
```

### Étape 4 : Accéder à l'application

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **API Gateway** | http://localhost:8084 |
| **Keycloak** | http://localhost:8080 |
| **produit service** | http://localhost:8081 |
| **commande** | http://localhost:8082 |


### Comptes de test

- **Admin** : `admin` / `admin123`
- **Client** : `client1` / `client123`

---


### Auteur
** CHERRAD NOURA **
