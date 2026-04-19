# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.0.0-beta.4] - 2026-04-19

- **0a11e15 - merge(develop): fix origin_app tracking and EAS build hook (nXhermane)**

- **bdcd015 - fix(auth): set origin_app only when null; fix DeactivatedScreen button styles; read version from package.json in EAS hook (nXhermane)**
  > - auth: replace upsert(ignoreDuplicates) with update().is('origin_app', null)
  >   so origin_app is stamped on first login and never overwritten
  > - DeactivatedScreen: remove explicit bg-primary class and use text-white on
  >   button icon and label for correct theming
  > - eas-build-on-success: read version from package.json via jq instead of
  >   unreliable EAS_BUILD_APP_VERSION env var

- **870d20a - ci(scripts): fix eas build on success execution error . use eas build id to build artefact url. (nXhermane)**

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.0.0-beta.3] - 2026-04-19

- **3bd441c - Merge branch 'develop' into beta (nXhermane)**

- **b340541 - ci(release): replace EAS polling with on-success dispatch hook (nXhermane)**
  > - Add eas-build-on-success.sh to trigger finalize-release via Cloudflare
  >   dispatch proxy on preview/production builds
  > - Register hook in eas.json for preview and production profiles only
  > - Refactor finalize-release.yml to use repository_dispatch instead of
  >   scheduled polling; version and artifact_url come from client_payload
  > - Remove check-eas-build.mjs and parse-draft-release.mjs (no longer needed)

- **9bab759 - ci(release): replace EAS polling with on-success dispatch hook (nXhermane)**
  > - Add eas-build-on-success.sh to trigger finalize-release via Cloudflare
  >   dispatch proxy on preview/production builds
  > - Register hook in eas.json for preview and production profiles only
  > - Refactor finalize-release.yml to use repository_dispatch instead of
  >   scheduled polling; version and artifact_url come from client_payload
  > - Remove check-eas-build.mjs and parse-draft-release.mjs (no longer needed)

- **9e03656 - feat(app): account deactivation guard, location setup, sync v2 protocol, and home screen redesign (nXhermane)**
  > auth & account:
  > - add isAccountActive$ computed from profile.is_active
  > - add Stack.Protected guard for deactivated accounts
  > - add DeactivatedScreen with contact and logout actions
  > - add CopyrightNotice shared component (replaces inline text)
  > - reset locationPromptShownThisSession on logout
  > profile & location:
  > - add facility, service, department, health_zone fields to UserProfile
  > - add location cascade component (department → facility → service)
  > - add location tab to EditProfileSheet with step-by-step selection
  > - add useLocationPrompt hook to prompt users missing department_id
  > - add LocationPromptSheet to HomeScreen
  > - add reference data store (departments$, facilities$, services$)
  > - add Supabase migrations for reference tables and profile location columns
  > sync protocol v2:
  > - rename all MessageType enum values to explicit CLIENT_/SERVER_ prefixes
  > - rename sync handler files to match new message type naming
  > - add SERVER_ACK_SYNC_REQUEST and updated-patients handler
  > - add ack-sync-request handler
  > - remove sync-ready handler (replaced by ack-sync-request)
  > - update SyncSessionService to register handlers with new message types
  > home screen redesign:
  > - add DailyProgressCard with animated today's task progress to header
  > - add health center/service display in header greeting
  > - replace header search bar with inline search in patient list subheader
  > - auto-collapse header when search opens
  > - interpolate subheader background color on scroll (bg → surface)
  > - add status filter to patient list bottom sheet
  > - enrich PatientCard with status pill, task breakdown by type, and progress bar
  > - move STATUS_CONFIG to constants/patient.ts
  > - add status field to home filters store
  > - remove scale animation on header logo and actions on collapse
  > patient dashboard:
  > - add status pill and today's task badge to PatientHero
  > - add colored done/total badges to TasksTab sub-tabs
  > - add visit time to VisitCard date display
  > schema & data:
  > - add PatientStatus enum to patient schema
  > - add status field to patientSchema, createPatientSchema, updatePatientSchema
  > - add constants/patient.ts with STATUS_CONFIG
  > - remove tasks.mock.ts
  > - update Supabase database types

- **f567308 - chore(release): v2.0.0-beta.2 [skip ci] (github-actions[bot])**

- **3d3a318 - Merge branch 'develop' into beta (nXhermane)**

- **2fee5b5 - fix: resolve ui styling, disable blur effect, and update schemas (nXhermane)**
  > - Remove hardcoded borders and `rounded-3xl` classes from Surface components in Settings and DynamicForm, adding `p-2` padding.
  > - Disable `blurEnabled` in UI settings by default pending refactoring and remove `BlurView` from `VisitFormScreen`.
  > - Change `EDEMA_GODET_COUNT` observation field type from `RANGE` to `ENUM` for discrete grade selection (Absent to +++).
  > - Implement structured `logger.warn` replacing `console.warn` in the user store and ensure it throws explicit errors.
  > - Remove leftover debugging `console.log` in anthropometry form conditions and formatting adjustments.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.0.0-beta.2] - 2026-04-18

- **3d3a318 - Merge branch 'develop' into beta (nXhermane)**

- **83e1f0b - fix: resolve ui styling, disable blur effect, and update schemas (nXhermane)**
  > - Remove hardcoded borders and `rounded-3xl` classes from Surface components in Settings and DynamicForm, adding `p-2` padding.
  > - Disable `blurEnabled` in UI settings by default pending refactoring and remove `BlurView` from `VisitFormScreen`.
  > - Change `EDEMA_GODET_COUNT` observation field type from `RANGE` to `ENUM` for discrete grade selection (Absent to +++).
  > - Implement structured `logger.warn` replacing `console.warn` in the user store and ensure it throws explicit errors.
  > - Remove leftover debugging `console.log` in anthropometry form conditions and formatting adjustments.

- **2fee5b5 - fix: resolve ui styling, disable blur effect, and update schemas (nXhermane)**
  > - Remove hardcoded borders and `rounded-3xl` classes from Surface components in Settings and DynamicForm, adding `p-2` padding.
  > - Disable `blurEnabled` in UI settings by default pending refactoring and remove `BlurView` from `VisitFormScreen`.
  > - Change `EDEMA_GODET_COUNT` observation field type from `RANGE` to `ENUM` for discrete grade selection (Absent to +++).
  > - Implement structured `logger.warn` replacing `console.warn` in the user store and ensure it throws explicit errors.
  > - Remove leftover debugging `console.log` in anthropometry form conditions and formatting adjustments.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.0.0-beta.1] - 2026-04-18

- **1656978 - Merge branch 'develop' into beta (nXhermane)**

- **18467fd - fix(ci): restore SECRET_TOKEN for checkout to allow push on protected beta branch (nXhermane)**

- **d72f0b0 - Merge branch 'develop' into beta (nXhermane)**

- **dfc8680 - fix(ci): use default github token for checkout instead of invalid custom secret (nXhermane)**

- **417f62d - Merge branch 'develop' into beta (nXhermane)**

- **5072ccd - fix(ci): resolve invalid YAML syntax on line 92 in release workflow (nXhermane)**

- **54c34ee - Merge pull request #25 from nXhermane/develop (nXhermane)**
  > Merge into 'beta' from 'develop'

- **6edaad4 - chore(config): resolve eslint errors and update husky hooks (nXhermane)**
  > - Migrate ignore patterns from deprecated .eslintignore to eslint.config.js
  > - Add eslint-disable rule in tcp-client.ts to fix unresolved .pem import error
  > - Remove deprecated initialization scripts from .husky/commit-msg for v10 compatibility

- **2e3dee9 - Merge branch 'beta' into develop (nXhermane)**

- **1e6e8bd - refactor!: migrate to Expo 55, HeroUI Native & Supabase-backed architecture (nXhermane)**
  > BREAKING CHANGE: Full architecture overhaul — store, schemas, services and
  > UI layer have been restructured. Legacy models, utils and gluestack-ui v3
  > components are removed.
  > Core changes:
  > deps: upgrade Expo SDK to v55, replace nativewind v4 with uniwind + HeroUI
  > Native v1, add expo-linear-gradient, @shopify/flash-list, tailwindcss v4,
  > supabase CLI scripts and react-native-enriched-markdown
  > refactor(store): decompose monolithic store into domain stores
  > (patients, measures, visits, tasks, registry, sync, ui, user, settings,
  > config); remove legacy store/models.ts and store/index.ts flat exports
  > refactor(schemas): replace src/models/schemas/* with src/schemas/* using
  > valibot — patient, visit, task, registry, measures (anthropometric,
  > biological, clinical-field) and edit-profile schemas
  > refactor(services): restructure TCP client into src/services/tcp-client/
  > with Framer class for stream framing; refactor WifiManager into dedicated
  > module; add full sync protocol layer (sync-session.service, 13 handlers,
  > protocol types, message-handler)
  > feat(auth): add supabase auth service (Google Sign-In, session tracking,
  > user_app_activity upsert), user store (user$, userProfile$ synced with
  > Legend State), logout hook and auth state hook
  > feat(ui/sync): redesign SyncScreen with animated SyncIdleView,
  > SyncProgressView with phase badge, polished QRScannerSheet (torch toggle,
  > animated scan corners); add useSyncSession hook driving WiFi + TCP flow
  > refactor(hooks): replace ViewModel-pattern hooks with action-based hooks
  > (usePatientActions, useMeasureActions, useTaskActions, useVisitActions,
  > useLogout, useAuthState, useFonts, useToast)
  > refactor(lib): consolidate helpers into src/lib/utils/ (logger, date,
  > crypto, haptics, sync-qr, random) and src/lib/helpers/forms/ (anthropometry,
  > biology, data-fields)
  > refactor(ui): update all gluestack-ui components to v5 alpha; migrate
  > Settings, PatientDashboard, VisitForm, PatientForm screens to new store and
  > schema APIs; add EditProfileSheet, LogoutSheet, BlurView, SmartInput,
  > MarkdownText, MeshGradientBackground shared components
  > chore(config): add supabase:generate and supabase:login scripts to
  > package.json; update taiwlind.config to v4 format; add Supabase database
  > types (database.types.ts) and storage service
  > chore: remove legacy files (tailwind.config.js v3, src/utils/*, src/models/*,
  > src/providers/Toast.tsx, src/providers/UIContext.tsx, old TcpClient.ts,
  > WifiManager.ts, useSyncManager.ts, useWifiCheck.ts)
  > ci(release): implement automated zero-downtime release pipeline
  > with robust bump-version.mjs, cron-based finalize-release.yml polling for
  > non-blocking EAS builds, branch-based triggers, and multi-line commit support
  > in generate-changelog.mjs

- **ceebaba - chore(deps): upgrade to expo 55 (nXhermane)**

- **167e247 - chore(config): update package and icons (nXhermane)**

- **64ba8cc - Merge pull request #21 from nXhermane/nXhermane-patch-2 (nXhermane)**
  > Update user-guide.md

- **3833a76 - Update user-guide.md (nXhermane)**

- **2569996 - Merge pull request #20 from nXhermane/nXhermane-patch-1 (nXhermane)**
  > Update README.md

- **e445a25 - Update README.md (nXhermane)**

- **28af363 - ci/feat: implementation of CI/CD workflows, P2P communication, and UI/UX enhancements (#19) (nXhermane)**
  > * chore(setup): Setup github actions
  > * feat: setup GitHub Actions + changelog + commit validation
  > - Add GitHub Actions for linting, stable & beta releases
  > - Add changelog generation script (auto-updated on release)
  > - Add commit message validation via Husky + Conventional Commits
  > - Update README with beta status and new features
  > - Add ROADMAP.md with updated roadmap
  > * chore(build): add GitHub Actions workflow to build and release preview APK
  > - Trigger workflow on beta version tag pushes matching vX.X.X-beta.X pattern
  > - Checkout repository with full history for changelog generation
  > - Setup Node.js 18 and Expo CLI latest versions for build
  > - Install dependencies using bun package manager
  > - Build Android APK using EAS preview profile non-interactively
  > - Download generated APK artifact for release attachment
  > - Generate changelog from git commits between last tag and current tag
  > - Create GitHub prerelease with changelog and attached APK file
  > * chore(workflow): add GitHub Actions workflow for EAS production build and release AAB
  > - Trigger workflow on push of stable version tags (vX.X.X)
  > - Setup Node.js 18 and Expo with EAS latest versions for build environment
  > - Install dependencies using bun package manager
  > - Run EAS build for Android production profile in non-interactive mode
  > - Download generated AAB artifact from latest EAS build
  > - Generate changelog from Git commit history between tags
  > - Create GitHub Release with changelog and attach AAB file
  > - Configure permissions for writing contents and creating releases
  > * chore(workflows): inject environment variables into EAS build steps
  > - Add public environment variables EXPO_PUBLIC_QRCODE_SENDER_APP_ID and
  >   EXPO_PUBLIC_QRCODE_RECEIVER_APP_ID to .env file in preview and production workflows
  > - Add secret environment variable EXPO_SECRET_KEY to .env file in both workflows
  > - Ensure variables are available during eas build commands for Android platform
  > - Apply these changes to both eas-preview.yml and eas-production.yml workflows
  > * fix(ci): update GitHub workflows for beta build and release
  > - Correct tag pattern regex in eas-preview workflow trigger
  > - Add Bun setup step and configure Expo & EAS CLI usage
  > - Create .env file with public and secret environment variables
  > - Refine EAS build and APK download commands with updated JSON keys
  > - Simplify release notes body for beta releases in eas-preview
  > - Modify release-beta workflow to commit changes locally without pushing
  > - Add files like package.json and app.config.ts to GitHub release artifacts
  > * fix(patient_form): correct condition key from hasParent2 to has_parent_2 (#7)
  > - Updated condition check in addPatientFormConfig from hasParent2 to has_parent_2
  > - Ensured consistent naming convention in patient_form.tsx
  > - Prevent potential form rendering issues related to incorrect data keys
  > * fix(patient): enable key extractor and disable scroll in patient measures list to fix the nested virtuallist inside scrollview warning (#8)
  > * Feat/add p2p communication for data transfering (#10)
  > * chore(setup): add the p2p communication dependencies and configure it .
  > - Include ACCESS_NETWORK_STATE, ACCESS_WIFI_STATE, CHANGE_WIFI_STATE permissions
  > - Add ACCESS_FINE_LOCATION and ACCESS_COARSE_LOCATION permissions
  > - Update react-native-vision-camera config to use expanded array format
  > - Add react-native-tethering/wifi and react-native-tcp-socket dependencies in package.json and bun.lock
  > - Add eventemitter3 as a new dependency for react-native-tcp-socket usage
  > * chore(config): update app config and dependencies
  > - Correct app name and slug casing in app.config.ts
  > - Reduce Android permissions to only CAMERA and RECORD_AUDIO
  > - Replace react-native-tethering/wifi with react-native-wifi-reborn dependency
  > - Update eas.json CLI version requirement to >= 16.28.0
  > - Update EAS project ID to new value
  > - Remove obsolete dependencies from lock and package files
  > - Add react-native-wifi-reborn to dependencies and bun.lock with version 4.13.6
  > * fix(app.config): correct app name typo
  > - Changed app name from 'MalnutriX ollect' to 'MalnutriX collect' in configuration file
  > * refactor(sync): remove patient import/export features and unify sync functionality
  > - Removed import_patients and export_patients screens and related components
  > - Eliminated hooks and store modules related to patient import/export
  > - Updated main navigation to replace export and import routes with sync route
  > - Simplified index.tsx by removing export patient logic and adjusting navigation
  > - Removed QR code animation and modal components related to importing/exporting
  > - Cleaned up utility functions and constants for MalnutriX QR code format handling
  > - Added buffer dependency and updated imports for crypto utilities
  > * fix(sync): improve QR code error handling and sync modal feedback
  > - Add toast notifications on QR code scan errors in SyncScreen
  > - Refactor QR code processing with try/catch and haptic feedback
  > - Update SyncModal to show connection error toasts on WiFi and TCP failures
  > - Display detailed sync progress and finished states with icons and buttons
  > - Add useCallback hooks in useSyncManager for memoization and stability
  > - Fix JSON parsing and decoding error handling in malnutrix_format utility
  > - Enhance ToastProvider to support optional toast IDs and improved logging
  > * chore(deps): add expo intent launcher to enable wifi before connection
  > * fix(sync): enhance WiFi and TCP error handling in SyncModal
  > - Add WiFi and TCP connection status management with detailed UI feedback
  > - Implement retry mechanism for failed WiFi and TCP connections
  > - Introduce error messages display on connection failures
  > - Update SyncModal layout with loading and error states for better UX
  > - Add useWifiCheck hook to verify and enable WiFi before syncing
  > - Modify fab button to check WiFi connectivity before navigation
  > - Implement crypto availability check and show configuration error if missing
  > - Refactor crypto utils to use AES-256-GCM with proper initialization and error handling
  > - Update malnutrix_format to decode data using new crypto methods
  > - Export WifiManager methods for checking and setting WiFi enabled state
  > * chore(deps): remove expo-intent-launcher dependency because i don't need it anymore
  > * fix(tcpclient): enable TLS connection with custom CA certificate
  > - Update TcpClient to use net.connectTLS with TLS options
  > - Add localAddress and reuseAddress options in connect method
  > - Load CA certificate from assets/crypto/server-cert.pem for verification
  > - Modify metro.config.js to include 'pem' in asset extensions for bundling
  > - Remove unused status and error properties in TcpClient class initialization
  > * chore(ci): add PEM file generation step in EAS preview workflow
  > - Generate PEM file from secret in CI pipeline
  > - Create assets/crypto directory to store the PEM file
  > - Move temporary PEM file to target directory for usage
  > - Keep bun install dependency installation step unchanged
  > * refactor(metro): simplify nativewind metro config
  > * refactor(sync): restructure sync modal and improve TCP client implementation
  > - Reordered and grouped imports in SyncModal for better readability
  > - Added comprehensive type annotations and comments for sync communication payloads
  > - Enhanced SyncModal with detailed documentation explaining each synchronization step
  > - Fixed sync status handling for SyncProcessCompleted message type
  > - Adjusted UI container styles for consistent height and alignment across sync states
  > - Corrected text typos in UI messages
  > - Updated button text color to use foreground theme for better accessibility
  > - Refactored useSyncManager to add detailed enums and comments for client and server message types
  > - Improved type safety and logging in patient data validation during import
  > - Redesigned TcpClient class with clear method comments and structured event handling
  > - Implemented TLS connection setup with certificate loading for secure communication
  > - Added reconnect and disconnect logic to TcpClient for resource management
  > - Provided method to send JSON serialized data over TCP with write callback handling
  > - Encapsulated event subscription interface for TcpClient listeners
  > * docs(sync): update README and roadmap to reflect WiFi/TCP synchronization
  > - Replace QR code import description with WiFi/TCP socket synchronization details
  > - Add detailed data transmission workflow using WiFi network and TCP protocol
  > - Mark remote server synchronization as completed in roadmap
  > - Remove outdated mention of QR code import and planned synchronization features
  > - Clarify synchronization steps including connection, transfer, and data integration
  > * refactor(ui): improve the ui with new design  (#12)
  > * refactor(ui): improve patient and measure list item interactions with swipe actions
  > - Replace long press delete with swipeable delete buttons in patient and measure lists
  > - Update FAB and buttons styles with emerald color palette and hover effects
  > - Enhance list empty states with clearer and dynamic messages based on search input
  > - Adjust header and splash screen text colors to emerald variants for better theming
  > - Refine form button styles and spinner colors to match updated emerald theme
  > - Improve toast component with dismiss button and border styling adjustments
  > - Modify UI input focus styles from green to emerald for consistency
  > - Add animated swipe actions with smooth translation for delete buttons
  > - Remove unused state for hiding FAB on scroll; keep FAB always visible
  > - Clean up redundant avatar badge from patient measures and update icon usages
  > * Update src/components/custom/FieldWrapper.tsx
  > * Update src/components/custom/FieldWrapper.tsx
  > * Update src/components/custom/FieldWrapper.tsx
  > * fix(ci): add non-interactive flag to eas build list command
  > * chore(eas_ci): add eas build pre install scripts for pem file biulding from en variable
  > * fix(ci): remve pem file generation in eas preview github action
  > * feat(patient): add pediatric age validation and update form handling (#14)
  > - Add age limit validation to patient schemas to restrict pediatric registrations
  > - Convert age difference calculation to use days and months constants
  > - Update form submission to handle both add and update with typed data transfer objects
  > - Log success messages and navigate back after patient add/update operations
  > - Remove unused helper functions related to parent info retrieval
  > - Import and use DAY_IN_MONTHS constant for correct age calculations in validation and hooks
  > * refactor(ci): unify and enhance release workflows with local builds (#15)
  > - Remove eas-preview.yml and eas-production.yml workflows
  > - Update pr-lint.yml to specify pull request event types and setup Node.js 20
  > - Revamp release-beta.yml to include version bump, changelog generation, and local APK build with EAS
  > - Revamp release-main.yml to include version bump, changelog generation, local AAB build with EAS, and push changes with token
  > - Add explicit environment variables and artifact naming for clarity in release workflows
  > - Improve GitHub Release creation with local artifact uploads and changelog integration
  > * feat(ui): Update patient form and validation schema with improved dashboard UI (#18)
  > - Enhance patient form UI with better layout and validation feedback
  > - Update Header component styling and functionality
  > - Improve SplashScreen with updated branding elements
  > - Refactor patient schema with enhanced validation rules and type
  >   definitions
  > * feat(docs): add user guide and update app branding
  > - Replace nutriped logo with new malnutix logo
  > - Add comprehensive user guide for healthcare workers
  >  - Include screenshots and video demonstrations of app usage
  >  - Add required validation for date of birth and sex fields in patient form
  >   - Improve phone number validation to allow empty values
  >    - Remove unused nutriped logo files
  > * refactor(docs): add video link to docs

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
