# DriveGallery

# Project Overview

DriveGallery is a **Progressive Web Application (PWA)** that transforms Google Drive into a beautiful photography gallery platform.

The application never stores image files.

Google Drive remains the source of truth for all media.

MongoDB stores only metadata and relationships.

The application supports:

* Personal galleries
* Collections
* Collaborative events
* QR invitations
* Cross-device experience
* Installable PWA
* Internal observability API

---

# Core Philosophy

DriveGallery is:

* Metadata platform
* Google Drive companion
* Device-adaptive PWA
* Privacy-first
* Read-only toward original files

DriveGallery is NOT:

* Cloud storage
* Social media
* Image hosting platform
* File synchronization service

---

# Technology Stack

## Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* Zustand

---

## Backend

* Next.js Route Handlers
* Server Actions
* Auth.js

---

## Database

MongoDB Atlas

Stores only:

* Users
* Metadata
* Collections
* Events
* Galleries
* Telemetry

Never stores images.

---

## External Services

Google Drive API

Google Picker API

Google OAuth

---

## Deployment

Vercel

---

# Architecture

Follow this dependency direction.

```text
Component

↓

Hook

↓

Service

↓

Repository

↓

MongoDB / Google Drive
```

Never skip layers.

Never access MongoDB from React.

Never access Google APIs from React.

---

# Folder Structure

Every feature belongs inside

```text
src/features/
```

Shared components belong inside

```text
src/components/
```

Never create new top-level folders.

---

# Coding Principles

Always follow

* SOLID
* DRY
* KISS
* YAGNI

Write beginner-friendly code.

Prefer readability.

Avoid unnecessary abstraction.

---

# UI Philosophy

Photography comes first.

The interface should disappear.

Design inspiration:

* Apple Photos
* Leica
* Linear
* Arc Browser
* Monograph Magazine

Avoid dashboard aesthetics.

---

# Device Philosophy

One codebase.

Multiple interaction models.

Desktop

* Mouse
* Keyboard
* Sidebar

Tablet

* Touch
* Split View
* Bottom Sheet

Mobile

* Bottom Navigation
* Gestures
* One-handed usage

Never build separate applications.

---

# Motion Philosophy

Animations should explain state changes.

Use

* Framer Motion
* Shared Element Transitions
* Spring Animations

Never use decorative animations.

Respect reduced-motion preferences.

---

# Security Rules

Always

* Authenticate
* Authorize
* Validate

Never

* Delete Google Drive files
* Modify image contents
* Store OAuth secrets in plaintext
* Store image binaries

---

# Google Drive Rules

Google Drive owns images.

DriveGallery owns metadata.

Only the `GoogleDriveService` communicates with Google APIs.

---


# Current Folder Ownership

```text
app/
Routing

components/
Reusable UI

features/
Feature Modules

repositories/
MongoDB

services/
Business Logic

schemas/
Validation

models/
Mongo Models

hooks/
React Hooks

utils/
Pure Utilities
```

---

# Commands

Install

```bash
npm install
```

Setup

```bash
npm run setup
```

Development

```bash
npm run dev
```

Verification

```bash
npm run verify
```

Production

```bash
npm run build
```

---

# Documentation Map

Only load documents required for the current task.

## Foundation

* 01_README.md
* 03_ARCHITECTURE.md
* 10_CODING_STANDARDS.md

---

## Database

Load only when changing MongoDB.

* 04_DATABASE_SCHEMA.md

---

## APIs

Load only when changing APIs.

* 05_API_SPECIFICATION.md

---

## Security

Load only when changing authentication.

* 06_SECURITY_MODEL.md

---

## Google Drive

Load only when working with:

* Picker
* OAuth
* Metadata
* Synchronization

Document

* 07_GOOGLE_DRIVE_INTEGRATION.md

---

## UI

Load only when building UI.

* 08.1_DESIGN_SYSTEM_FOUNDATION.md
* 08.2_COMPONENT_LIBRARY.md
* 08.3_DEVICE_EXPERIENCE_AND_INTERACTIONS.md

---

## Architecture

Load only for major structural changes.

* 09_SYSTEM_DESIGN.md

---

## Product

Load only when implementing features.

* 11_PRODUCT_REQUIREMENTS_DOCUMENT.md

---

## Setup

Load only during initialization.

* 12_FOLDER_STRUCTURE.md
* 13_DEVELOPMENT_SETUP.md
* 14_ENVIRONMENT_CONFIGURATION.md

---

## Observability

Load only when implementing telemetry.

* 15_INTERNAL_OBSERVABILITY_API.md

---

# Current Roadmap

Phase 0

Project Setup

↓

Phase 1

Authentication

↓

Phase 2

Profile

↓

Phase 3

Google Drive Integration

↓

Phase 4

Gallery

↓

Phase 5

Collections

↓

Phase 6

Events

↓

Phase 7

Search

↓

Phase 8

Device Optimization

↓

Phase 9

Observability

↓

Phase 10

Testing

↓

Phase 11

Deployment

---

# Definition of Done

A feature is complete only if:

* Architecture respected
* SOLID followed
* Validation implemented
* Repository created
* Service created
* Types created
* Responsive
* Accessible
* Theme compatible
* Tested (where applicable)
* Documentation updated if behavior changes

---

# Things AI Must Never Do

* Create duplicate components
* Create duplicate services
* Access MongoDB from UI
* Access Google APIs from UI
* Store image binaries
* Delete Google Drive files
* Hardcode secrets
* Use `any`
* Ignore validation
* Break the folder structure
* Invent undocumented APIs

---

# AI Decision Rules

Before writing code ask:

1. Does this feature already exist?
2. Which feature owns this code?
3. Which service owns the logic?
4. Which repository owns the data?
5. Which documentation applies?
6. Can existing components be reused?

If uncertain, stop and ask for clarification.

---

# Mission Statement

Build DriveGallery as a professional, scalable, and maintainable Progressive Web Application that provides a premium photography experience while preserving user ownership of all media stored in Google Drive.

Every implementation decision should prioritize:

* Simplicity
* Security
* Performance
* Accessibility
* Maintainability
* User ownership
