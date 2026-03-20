# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Koum is Africa's freight intelligence layer — a zero-build-step, single-file web app (`index.html`, ~2400 lines). No npm, no bundler, no framework. Open the file directly in a browser to develop or preview. There is no build, lint, or test command.

## Architecture

Everything — HTML structure, CSS design system, and all JavaScript — lives in one file. The logical structure within that file:

1. **CSS design system** (lines ~10–1022) — CSS variables for three visual modes: light (`:root`), dark (`[data-theme="dark"]`), and Mission Control (`[data-role="mission"]`). Three font families: `--fd` (Fraunces, serif), `--fu` (Manrope, sans), `--fi` (Inter, sans).

2. **Data layer** (lines ~1023–1115) — Static seed data (`LOADS` array), Supabase config (`SB` URL + `ANON` key), and `MC_AGENTS` list of AI agents.

3. **i18n** (lines ~1116–1301) — `T` object with keys for `en`, `fr`, `sw`, `rw`. All user-visible strings live here. Access via `t('key')` or `T[S.lang]['key']`.

4. **Global state** (line ~1303) — Single object `S = {lang, role, theme, selLoad, loads, mcAuth}`. Mutate directly; no reactivity layer.

5. **Screen routing** (lines ~1309–1314) — Four top-level screens (`.scr` class): `#landing`, `#onboarding`, `#app`, `#mc`. Switched via `show(id)`. Entry points: `goLand()`, `goOnboard()`, `goApp()`, `goMC()`.

6. **Page rendering** (lines ~1526–1874) — `renderPages()` builds the app canvas by calling `pgXxx()` functions that return HTML strings. Pages are filtered by `S.role`. Active page toggled via `navTo(id)`.

7. **Supabase integration** (line ~2351) — `fetchLoads()` hits the `loads` table; falls back to seed data on failure.

## User roles

Four roles, each with distinct nav and pages: `shipper`, `carrier`, `broker`, `dispatcher`. Role is stored in `S.role`. Navigation config (`NAV_CONFIG`) and page visibility in `renderPages()` both key off this.

## Screens

| Screen | ID | Purpose |
|--------|----|---------|
| Landing | `#landing` | Dark brand-first marketing page |
| Onboarding | `#onboarding` | 3-step role/auth flow |
| App | `#app` | Main freight platform shell (sidebar + canvas) |
| Mission Control | `#mc` | Admin/ZaphenathEnvoy bridge — dark cinematic UI, passphrase-protected |

## Key patterns

- **DOM helpers**: `$(id)` = `document.getElementById(id)`, `t(key)` = translation lookup
- **Translations**: Always add new strings to all four language objects in `T`. Apply to DOM via `applyTranslations()`.
- **Toasts**: `toast('message', 's'|'i'|'')` — success, info, or default
- **Modals**: `openM('modal-id')` / `closeM('modal-id')`
- **Theme**: `S.theme` + `data-theme` attribute on `<html>`; Mission Control uses `data-role="mission"` instead

## AI agents (MC_AGENTS)

Listed in Mission Control: PricingAgent, MatchAgent, BackhaulAgent, FraudAgent, RouteAgent, CreditAgent, DocumentAgent, NotificationAgent, ZaphenathEnvoy (orchestrator, 15-min Telegram check-in). All are named/described in the `MC_AGENTS` array; stub implementations are referenced via `toast()` calls throughout the UI.

## Supabase

Project ref: `dzpfsoykjpuovmsoekax`. The `ANON` key is hardcoded in the file. The app reads from a `loads` table and gracefully degrades to seed data (`LOADS`) when the fetch fails.
