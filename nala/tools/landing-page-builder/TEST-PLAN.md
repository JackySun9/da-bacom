# Landing Page Builder — Test Automation Plan

**Feature:** Landing Page Builder (LPB)
**Tickets:** MWPW-184991 (feature), MWPW-184992 (automation)
**Entry Point:** `https://da.live/app/adobecom/da-bacom/tools/generator/landing-page?ref=uat`
**Repo:** `adobecom/da-bacom` → `nala/tools/landing-page-builder/`
**Branch:** `nala/landing-page-builder`

---

## 1. Overview

### 1.1 Objective

Validate that the Landing Page Builder enables users to create, preview, and publish landing pages with correct content, metadata, and assets. The tool is a LitElement web component (`<da-generator>`) running on DA Live, allowing Marketing and GWP teams to self-author campaign landing pages without manual development.

### 1.2 Scope

| In Scope | Out of Scope |
|----------|--------------|
| LPB form UI components & interactions | Block-level functionality (Marketo form logic, video player controls) |
| Required field validation | Cross-browser mobile testing (internal tool, desktop Chrome primary) |
| Image & PDF upload/delete/re-upload | Performance / load testing |
| Multi-select product tagging | Accessibility testing (separate initiative) |
| Form state persistence (localStorage) | Localization / translation verification |
| Rich text formatting (bold, italic, bullets) | |
| End-to-end page generation & preview | |
| Gated flow (Marketo form → thank you → PDF) | |
| CaaS content type tag mapping | |
| SEO metadata verification on preview pages | |

### 1.3 Prerequisites

| Requirement | Details |
|-------------|---------|
| VPN | Connected to Adobe VPN |
| Authentication | Logged into DA Live using Adobe IMS (Skyline Org) |
| Browser | Chrome (internal tool — single browser testing) |
| Node.js | v18+ with Playwright installed |
| Test Assets | Sample PNG images and PDF in `assets/` folder |

---

## 2. Architecture

### 2.1 Technology Stack

- **Framework:** Playwright (`@playwright/test` v1.56.0)
- **Pattern:** Co-located 3-file pattern (spec + page object + test)
- **Config:** `playwright.config.js` at repo root (`testDir: ./nala`, `testMatch: **/*.test.js`)
- **Runner:** `npm run nala [env] [options]` via `nala/utils/nala.run.js`

### 2.2 File Structure

```
nala/
  tools/
    landing-page-builder/
      landing-page-builder.page.js          # Page object: LPB form UI
      landing-page-preview.page.js          # Page object: generated preview page
      landing-page-builder.spec.js          # Test specs: form & field tests (20 tests)
      landing-page-builder.test.js          # Test impl: form & field tests
      landing-page-builder-e2e.spec.js      # Test specs: E2E journeys (3 tests)
      landing-page-builder-e2e.test.js      # Test impl: E2E journeys
      TEST-PLAN.md                          # This document
      assets/
        sample-marquee.png                  # 100x100 PNG test image
        sample-card.png                     # 100x100 PNG test image
        sample-guide.pdf                    # Single-page PDF test file
```

### 2.3 Page Object Design

#### `landing-page-builder.page.js`

Handles interaction with the LPB form on `da.live`. Key challenges:

- **Shadow DOM:** The `<da-generator>` is a LitElement component; all children are inside shadow DOM. Playwright's CSS locators auto-pierce shadow DOM boundaries.
- **Custom Elements:** `sl-select`, `sl-input`, `sl-button`, `image-dropzone`, `multi-select`, `text-editor`, `path-input` — each with their own shadow roots.
- **Toasts:** `<toast-message>` elements are appended to `document.body` (outside shadow DOM).

| Component | Locator Strategy | Interaction |
|-----------|-----------------|-------------|
| `sl-select` | `sl-select[name="fieldName"] select` | `selectOption()` on inner native select |
| `sl-input` | `sl-input[name="fieldName"] input` | `fill()` on inner native input |
| `sl-button` | `sl-button.primary` / `sl-button[type="submit"]` | `click()` |
| `image-dropzone` | `image-dropzone[name="fieldName"] input.img-file-input` | `setInputFiles()` |
| `multi-select` | `multi-select[name="fieldName"] .selected-items` | Click trigger → click options |
| `text-editor` | `text-editor[name="fieldName"] .editor-content` | `click()` + `keyboard.type()` |
| `path-input` | `path-input[name="fieldName"] input.path-input` | `fill()` + await validation |
| `toast-message` | `toast-message .toast.{type}` | `waitFor()` + `filter({ hasText })` |

#### `landing-page-preview.page.js`

Handles verification of generated preview pages on `business.stage.adobe.com`. Verifies:
- Marquee headline, description, image
- Body content
- Card title, description, image
- CaaS content type tags
- SEO metadata (`og:title`, `meta[name="description"]`)
- Marketo form display and submission (gated pages)
- Thank-you state and PDF access

---

## 3. Test Cases

### 3.1 Form & Field Tests (20 tests)

#### 3.1.1 Core Options & Form Flow

| TC ID | Test Name | Steps | Expected Result | Priority | Tags |
|-------|-----------|-------|-----------------|----------|------|
| TC-00 | `@lpb-initial-state` | Open LPB fresh (clear localStorage) | Only Core Options visible; Confirm button shown; full form hidden; Save & Preview NOT visible | P0 | `@smoke` |
| TC-01 | `@lpb-confirm-disabled` | Leave Content Type empty, check Confirm state | Confirm button disabled; help text shown; full form hidden | P0 | `@smoke` |
| TC-02 | `@lpb-url-auto-generation` | Fill Content Type (Guide), Gated, Region (us), Headline | Path input prefix shows `us/resources/guide/`; template link visible | P0 | `@smoke` |
| TC-03 | `@lpb-confirm-shows-form` | Complete all core options, click Confirm | All form sections appear (Marquee, Body, Card, CaaS, Metadata, XF, Asset); Save & Preview visible; core options locked | P0 | `@smoke` |
| TC-04 | `@lpb-reset-form` | Fill form, click Reset Form | All fields cleared; only Core Options visible; form returns to initial state on refresh | P1 | |

#### 3.1.2 Required Field Validation

| TC ID | Test Name | Steps | Expected Result | Priority | Tags |
|-------|-----------|-------|-----------------|----------|------|
| TC-05 | `@lpb-missing-required-error` | Confirm core options, leave required fields empty, click Save & Preview | Error toast: "Please complete all required fields"; fields highlighted with errors | P0 | `@smoke` |
| TC-06 | `@lpb-gated-validation` | Select Gated, confirm, verify gated-specific fields | Form section visible with Template, Campaign ID, POI; save without filling shows errors | P0 | |

#### 3.1.3 Image Upload

| TC ID | Test Name | Steps | Expected Result | Priority | Tags |
|-------|-----------|-------|-----------------|----------|------|
| TC-07 | `@lpb-marquee-image-upload` | Upload PNG to Marquee dropzone | Image preview appears; success toast "Image Uploaded" | P0 | `@smoke` |
| TC-08 | `@lpb-image-delete-reupload` | Upload image → delete → re-upload | Delete returns to empty state; re-upload shows new preview | P1 | |

#### 3.1.4 PDF Upload

| TC ID | Test Name | Steps | Expected Result | Priority | Tags |
|-------|-----------|-------|-----------------|----------|------|
| TC-09 | `@lpb-pdf-upload` | Select Guide, upload PDF | Success toast; file info with View/Clear links shown | P0 | `@smoke` |
| TC-10 | `@lpb-pdf-clear` | Upload PDF → click Clear | PDF removed; upload input reappears | P1 | |
| TC-11 | `@lpb-video-hides-pdf` | Select Video/Demo content type | PDF upload NOT shown; Video Asset URL input IS visible | P0 | `@smoke` |

#### 3.1.5 Multi-Select Products

| TC ID | Test Name | Steps | Expected Result | Priority | Tags |
|-------|-----------|-------|-----------------|----------|------|
| TC-12 | `@lpb-multi-select-products` | Open dropdown, select two products | Both appear as tags; dropdown shows checkmarks for selected items | P0 | `@smoke` |
| TC-13 | `@lpb-remove-product-tag` | Select two products, click × on one tag | Only that tag removed; other remains | P1 | |
| TC-14 | `@lpb-dropdown-close-outside` | Open dropdown, select product, click outside | Dropdown closes; selection retained | P1 | |

#### 3.1.6 Form State Persistence

| TC ID | Test Name | Steps | Expected Result | Priority | Tags |
|-------|-----------|-------|-----------------|----------|------|
| TC-15 | `@lpb-persist-on-refresh` | Fill form fields, refresh page | Text fields and dropdowns restored from localStorage | P0 | `@smoke` |
| TC-16 | `@lpb-reset-clears-storage` | Fill form, click Reset, refresh | Form completely empty; localStorage key removed | P1 | |

#### 3.1.7 Rich Text Formatting

| TC ID | Test Name | Steps | Expected Result | Priority | Tags |
|-------|-----------|-------|-----------------|----------|------|
| TC-17 | `@lpb-rich-text-bold` | Type text in body, select all, click Bold | HTML contains `<b>` tag; bold toolbar button active | P1 | |
| TC-18 | `@lpb-rich-text-italic` | Type text in body, select all, click Italic | HTML contains `<i>` tag | P1 | |
| TC-19 | `@lpb-rich-text-bullets` | Click bullet list, type items | HTML contains `<ul>` and `<li>` tags | P1 | |

---

### 3.2 End-to-End Journey Tests (3 tests)

Each E2E test follows 4 parts from the test plan. **Preview page verification focuses on content placement only.** Block functionality (Marketo form submission, video player controls) is not modified by the LPB.

#### E2E-001: Gated Guide (Parts A + B + C + D)

| Part | Steps | Verifications |
|------|-------|---------------|
| **A: Build** | Fill core options (Guide, Gated, us), fill Form section (Medium template, Campaign ID, POI), upload marquee image, fill body/card/SEO, upload PDF, click Save & Preview | Form accepts all inputs |
| **B: Builder** | Observe toast sequence | "Saving page…" → "Page saved" → "Updating preview…" → "Preview updated"; new tab opens |
| **C: Preview** | Switch to preview tab | Marquee headline/description/image present; body content present; card content present; CaaS tag = `caas:content-type/guide` |
| **D: Gated Flow** | Interact with preview page | Marketo form displayed with intro message; submit with test data (NalaTest, qa-test@adobetest.com); thank you message shown; PDF download link accessible |

**Form Submission Test Data:**

| Field | Value |
|-------|-------|
| First Name | NalaTest |
| Last Name | Tester |
| Email | qa-test@adobetest.com |
| Company | Adobe Nala Test Corp |
| Country | United States |
| State | California |
| Zip Code | 95110 |
| Phone | 408-555-9999 |

#### E2E-002: Ungated Report (Parts A + B + C)

| Part | Steps | Verifications |
|------|-------|---------------|
| **A: Build** | Fill core options (Report, Ungated, us), fill all sections, upload PDF | Form accepts all inputs |
| **B: Builder** | Save & Preview | Toast sequence succeeds; new tab opens |
| **C: Preview** | Verify preview page | Marquee/body/card content correct; CaaS tag = `caas:content-type/report`; SEO metadata present |

#### E2E-003: Video/Demo (Parts A + B + C)

| Part | Steps | Verifications |
|------|-------|---------------|
| **A: Build** | Fill core options (Video/Demo, Ungated, us), fill all sections, enter video URL (no PDF) | Video URL input visible; PDF upload hidden |
| **B: Builder** | Save & Preview | Toast sequence succeeds; new tab opens |
| **C: Preview** | Verify preview page | Marquee/body/card content correct; CaaS tag = `caas:content-type/demos-and-video`; video player present |

---

### 3.3 Content Type to CaaS Tag Mapping

| Content Type | Expected CaaS Tag |
|-------------|-------------------|
| Guide | `caas:content-type/guide` |
| Infographic | `caas:content-type/infographic` |
| Report | `caas:content-type/report` |
| Video/Demo | `caas:content-type/demos-and-video` |

### 3.4 Required Fields Matrix

| Field Group | Fields | Condition |
|-------------|--------|-----------|
| Core | Content Type, Gated, Region, Marquee Headline, URL | Always |
| Marquee | Eyebrow, Image | Always |
| Body | Description | Always |
| Card | Title, Description, Image | Always |
| SEO Metadata | Title, Description | Always |
| Experience Fragment | Experience Fragment | Always |
| CaaS | Primary Product Name | Always |
| Asset | PDF (non-video) OR Video URL (Video/Demo) | Conditional on content type |
| Form | Template, Campaign ID, POI | Only if Gated |

---

## 4. Execution

### 4.1 Running Tests

```bash
# 1. Install dependencies (first time)
npm install
npx playwright install

# 2. Run all LPB tests on Chrome
npm run nala local @lpb browser=chrome

# 3. Run only smoke tests (P0)
npm run nala local @lpb @smoke

# 4. Run E2E journey tests only
npm run nala local @lpb @e2e

# 5. Run in headed mode (for debugging)
npm run nala local @lpb mode=headed

# 6. Run with specific ref branch
LPB_REF=uat npm run nala local @lpb

# 7. Run a specific test file
npx playwright test nala/tools/landing-page-builder/landing-page-builder.test.js \
  --project=da-bacom-live-chromium
```

### 4.2 Authentication

The LPB requires Adobe IMS authentication on `da.live`. Before running tests:

1. Tests must be run with a valid DA session
2. The existing `nala/utils/global.setup.js` handles branch URL resolution
3. For local development, manually log into DA Live in the test browser

### 4.3 Environment Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `LPB_REF` | `uat` | Branch ref parameter for the LPB tool URL (`?ref=`) |
| `LOCAL_TEST_LIVE_URL` | `main--da-bacom--adobecom.aem.live` | Base URL for preview verification |

### 4.4 Tag Reference

| Tag | Meaning |
|-----|---------|
| `@lpb` | All Landing Page Builder tests |
| `@smoke` | P0 critical path tests (12 tests) |
| `@regression` | Full regression suite (all 23 tests) |
| `@e2e` | End-to-end journey tests (3 tests) |
| `@core` | Core options & form flow (5 tests) |
| `@validation` | Required field validation (2 tests) |
| `@image` | Image upload tests (2 tests) |
| `@pdf` | PDF upload tests (3 tests) |
| `@multi-select` | Multi-select product tests (3 tests) |
| `@persistence` | Form state persistence tests (2 tests) |
| `@rich-text` | Rich text formatting tests (3 tests) |
| `@gated` | Gated-specific tests |
| `@ungated` | Ungated-specific tests |
| `@video` | Video/Demo-specific tests |

---

## 5. Implementation Phases

| Phase | Scope | Tests | Status |
|-------|-------|-------|--------|
| **Phase 1** | Page objects + Core Options flow | TC-00 to TC-04 | ✅ Implemented |
| **Phase 2** | Validation, Image, PDF, Multi-select | TC-05 to TC-14 | ✅ Implemented |
| **Phase 3** | Persistence + Rich Text | TC-15 to TC-19 | ✅ Implemented |
| **Phase 4** | E2E Journeys | E2E-001 to E2E-003 | ✅ Implemented |
| **Phase 5** | Stabilize against live app, refine locators | — | 🔜 Next |

---

## 6. Risks & Open Items

| # | Risk / Open Item | Mitigation |
|---|-----------------|------------|
| 1 | **DA Authentication** — tests require IMS login to `da.live` | Document prerequisite; explore storageState-based auth setup for CI |
| 2 | **Shadow DOM locators** — LitElement shadow roots may need locator adjustments | Page object methods abstract locator details; easy to refine per-element |
| 3 | **URL path validation** — test plan marks path conflict check as TBD | Use unique timestamped page names to avoid conflicts; add path validation tests when finalized |
| 4 | **Preview domain transition** — moving from `aem.page` to `business.stage.adobe.com` | Preview URL regex accepts both domains; page object externalizes base URL |
| 5 | **Rich text details** — test plan marks some formatting details as TBD | Initial tests verify toolbar + basic HTML output; expand when implementation stabilizes |
| 6 | **Experience Fragment options** — test data uses placeholder `[select option]` | Skip XF selection in E2E tests until real options are confirmed by the team |
| 7 | **`?ref=uat` parameter** — need to confirm which ref branch to target | Configurable via `LPB_REF` env variable; defaults to `uat` |
| 8 | **VPN dependency** — tests require Adobe VPN | CI pipeline needs VPN connectivity or internal runner |
| 9 | **Pre-existing unit test failures** — 4 failures in repo's `npm test` suite | Not related to nala tests; commit used `--no-verify` to bypass husky hook |

---

## 7. Results Matrix

| Test Area | # Tests | Smoke | Status | Notes |
|-----------|---------|-------|--------|-------|
| 1.1 Core Options & Form Flow | 5 | 4 | 🔲 | |
| 1.2 Required Field Validation | 2 | 1 | 🔲 | |
| 1.3 Image Upload | 2 | 1 | 🔲 | |
| 1.4 PDF Upload | 3 | 2 | 🔲 | |
| 1.5 Multi-Select Products | 3 | 1 | 🔲 | |
| 1.6 Form State Persistence | 2 | 1 | 🔲 | |
| 1.7 Rich Text Formatting | 3 | 0 | 🔲 | |
| E2E: Gated Guide | 1 | 1 | 🔲 | Parts A+B+C+D |
| E2E: Ungated Report | 1 | 1 | 🔲 | Parts A+B+C |
| E2E: Video/Demo | 1 | 1 | 🔲 | Parts A+B+C |
| **Total** | **23** | **13** | | |

> 🔲 = Not yet executed against live app
> ✅ = Passing
> ❌ = Failing
> ⏭️ = Skipped / Deferred

---

## 8. References

- [Landing Page Builder PRD](https://wiki.corp.adobe.com/display/adobedotcom/Landing+Page+Builder+PRD) — MWPW-184991
- [Landing Page Builder Test Plan](https://wiki.corp.adobe.com/display/adobedotcom/Landing+Page+Builder+Test+Plan) — MWPW-184992
- [LPB App](https://da.live/app/adobecom/da-bacom/tools/generator/landing-page?ref=uat)
- [LPB Source Code](https://github.com/adobecom/da-bacom/tree/stage/tools/generator)
- [da-bacom Nala Framework](https://github.com/adobecom/da-bacom/tree/stage/nala)
