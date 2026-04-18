# MalnutriX Collect

## 🎯 Vision

Réduire le temps de consultation des nutritionnistes en permettant aux aides-soignants de collecter les données patients à l'accueil, puis de les transmettre automatiquement à l'application MalnutriX Pro dédiée aux nutritionnistes.

## 📊 Contexte

### Problème actuel

- Les nutritionnistes passent 15-20 minutes par patient à saisir les données
- Cela ralentit les consultations et génère des erreurs de saisie
- Les aides-soignants n'ont pas d'outil dédié à la collecte

### Solution

Application mobile pour les aides-soignants permettant de :
1. Collecter les données patients (anthropométrie, signes cliniques, tâches)
2. Authentifier l'opérateur via Google Sign-In avec suivi de session
3. Transmettre les données au nutritionniste via WiFi/TCP Socket après scan d'un QR code

### Impact attendu

- Réduction de ~90% du temps de saisie côté nutritionniste
- Réduction des erreurs grâce à la validation stricte avec Valibot
- Consultations plus rapides et meilleure expérience patient

---

## 🚀 Fonctionnalités

### ✅ Implémentées

| Fonctionnalité | Détail |
|---|---|
| 👤 Gestion des patients | Création, modification, recherche, verrouillage post-sync |
| 📏 Mesures anthropométriques | Poids, taille, MUAC, périmètre crânien, TSF, SSF, signes cliniques |
| 🩺 Données biologiques & cliniques | Champs additionnels par patient |
| ✅ Tâches patients (Tasks) | Formulaires de tâches spécifiques assignées par le nutritionniste |
| 🔄 Synchronisation WiFi/TCP | Connexion automatique + transfert via protocole sécurisé (13 handlers) |
| 📲 QR code de sync | SyncIdleView + QRScannerSheet avec torch toggle et coins animés |
| 🔐 Authentification Supabase | Google Sign-In, session tracking, profil utilisateur |
| 👤 Profil utilisateur | EditProfileSheet, LogoutSheet, userProfile$ synchronisé |
| 💾 Stockage local hors ligne | MMKV + LegendState (stores domaines) |
| ✅ Validation stricte | Schémas Valibot (patient, visit, task, mesures, profil) |
| 📊 Historique des visites | Mesures par patient avec horodatage |
| 🔒 Verrouillage patients | Informations admin verrouillées après synchronisation |

### 🚧 En cours / Planifié

- Notifications (Notifee)
- Amélioration de l'accessibilité
- Dashboard d'administration
- Génération de rapports PDF
- Traductions (i18n)

Pour la vue complète → [ROADMAP.md](./ROADMAP.md)

---

## 🏗️ Architecture technique

### Stack

| Couche | Technologie |
|---|---|
| Framework | React Native + Expo SDK 55 |
| Navigation | Expo Router |
| UI | HeroUI Native v1 + TailwindCSS v4 + Uniwind |
| Animations | Moti + Reanimated |
| État global | LegendState v3 (stores domaines) |
| Formulaires | React Hook Form + Valibot |
| Stockage local | MMKV |
| Authentification | Supabase (Google Sign-In) |
| Réseau | TCP Socket + WiFi (react-native-tcp-socket, react-native-wifi-reborn) |
| Caméra / QR | react-native-vision-camera |
| Rendu texte | react-native-enriched-markdown |

### Structure du projet

```
src/
├── app/                   # Pages Expo Router
├── components/            # Composants UI réutilisables (BlurView, SmartInput, MarkdownText…)
├── schemas/               # Schémas Valibot (patient, visit, task, measures, auth…)
├── services/
│   ├── supabase/          # Auth, stockage, types DB
│   └── tcp-client/        # TcpClient + Framer (framing de streams TCP)
├── store/                 # Stores Legend State (patients, measures, visits, tasks, sync, user…)
├── hooks/                 # Hooks action-based (usePatientActions, useSyncSession, useAuthState…)
└── lib/
    ├── utils/             # logger, date, crypto, haptics, sync-qr, random
    └── helpers/forms/     # Helpers anthropometry, biology, data-fields
```

---

## 🔄 Workflow de synchronisation

1. **Collecte** — L'aide-soignant saisit les données du patient (mesures, tâches, signes cliniques)
2. **Scan QR** — Il scanne le QR code du nutritionniste contenant les infos de connexion (SSID, mot de passe WiFi, IP, port TCP)
3. **Connexion automatique** — L'app se connecte au réseau WiFi du nutritionniste et établit une session TCP sécurisée
4. **Transfert** — Les données des patients non synchronisés sont envoyées au serveur via le protocole Malnutrix Sync (13 handlers)
5. **Verrouillage** — Les patients synchronisés sont automatiquement verrouillés côté Collect

---

## 🛠️ Installation

### Prérequis

- Node.js >= 20
- Bun
- Expo CLI
- Compte EAS (Expo Application Services)

### Installation

```bash
git clone https://github.com/nXhermane/MalnutrixCollect.git
bun install
```

### Développement

```bash
bun start        # Démarrer en mode dev
bun android      # Lancer sur Android
bun ios          # Lancer sur iOS
bun lint         # ESLint
bun typecheck    # TypeScript
bun format       # Prettier
```

### Variables d'environnement

```bash
# Pousser les variables vers EAS (preview)
bun run env:push:preview

# Pousser les variables vers EAS (production)
bun run env:push:prod
```

### CI/CD

Le pipeline de release est entièrement automatisé :

- **Push sur `beta`** → bump de version bêta, build EAS `preview`, draft GitHub Release
- **Push sur `main`** → bump stable, build EAS `production`, draft GitHub Release
- **Cron toutes les 15min** → vérifie si le build EAS est terminé → publie la release avec l'APK

---

## 📅 Dates clés

- **Kickoff** : 25 novembre 2025
- **MVP (v1.0.0-beta.1)** : 12 décembre 2025
- **Déploiement bêta (v1.0.0-beta.7)** : 8 janvier 2025
- **Refactorisation majeure (v2.0.0)** : Avril 2026

## 🔗 Liens utiles

- [Repo GitHub](https://github.com/nXhermane/MalnutrixCollect)
- [ROADMAP](./ROADMAP.md)
- [Expo Dashboard](https://expo.dev)
