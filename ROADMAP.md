# Roadmap de MalnutriX Collect

## Phase 1 — MVP `v1.0.0-beta.1` (Terminé ✅)

- [x] Navigation de base
- [x] Gestion des patients (création, recherche, modification)
- [x] Formulaire de mesures anthropométriques (poids, taille, MUAC, périmètre crânien, signes cliniques)
- [x] Historique de visite par patient
- [x] Verrouillage des patients après synchronisation
- [x] Synchronisation WiFi/TCP Socket avec QR code (remplace l'ancien export QR code animé)
- [x] Stockage local hors ligne avec MMKV + LegendState
- [x] Validation des formulaires avec Valibot
- [x] UI Gluestack + animations

## Phase 2 — Refactorisation Architecturale `v2.0.0` (Terminé ✅)

> Refactorisation majeure post-`v1.0.0-beta.7`. Compatibilité rompue avec la version précédente.

- [x] Migration vers Expo SDK 55
- [x] Remplacement de Gluestack UI v3 par HeroUI Native v1 + Uniwind + TailwindCSS v4
- [x] Décomposition du store monolithique en stores domaines (patients, measures, visits, tasks, registry, sync, ui, user, settings, config)
- [x] Refactorisation des schémas avec Valibot (patient, visit, task, registry, anthropometric, biological, clinical-field, edit-profile)
- [x] Refactorisation du protocole TCP — Framer class pour la fragmentation de streams, 13 handlers, sync-session.service
- [x] Authentification Supabase — Google Sign-In, session tracking, activité utilisateur, profil
- [x] Profil utilisateur et gestion de la session (EditProfileSheet, LogoutSheet)
- [x] Gestion des tâches patients (Tasks) — remplace l'ancien concept de "données spécifiques"
- [x] Redesign de la SyncScreen (SyncIdleView animée, SyncProgressView avec badge de phase, QRScannerSheet avec torch toggle et coins animés)
- [x] Hooks action-based (usePatientActions, useMeasureActions, useTaskActions, useVisitActions, useLogout, useAuthState)
- [x] Consolidation des helpers (src/lib/utils/, src/lib/helpers/forms/)
- [x] Nouveaux composants partagés (BlurView, SmartInput, MarkdownText, MeshGradientBackground)
- [x] Pipeline CI/CD automatisé — bump sémantique sur commits conventionnels, build EAS non-bloquant, polling cron de finalisation de release

## Phase 3 — Stabilisation & Qualité (En cours 🚧)

- [ ] Notifications (Notifee)
- [ ] Amélioration de l'accessibilité

## Phase 4 — Évolutions futures (À planifier 📋)

- [ ] Dashboard d'administration
- [ ] Génération de rapports PDF par patient
- [ ] Synchronisation analytique Cloud (suivi d'usage, métriques d'application objectif)
- [ ] Traductions (i18n — Français, Anglais, Arabe)
- [ ] Support multi-établissements