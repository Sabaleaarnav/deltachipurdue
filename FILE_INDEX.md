# Delta Chi Purdue - Complete File Index

**Generated:** 2025-10-27
**Branch:** claude/index-files-011CUY9H1eQA19cdmhCsFzNL
**Total Files:** 50 (excluding .git)

---

## Repository Overview

This is a modern, headless CMS-driven static website for the Delta Chi Purdue University Chapter. The site uses Netlify CMS for content management, with all content stored as JSON files in a Git repository.

### Technology Stack
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **CMS:** Netlify CMS (Decap CMS)
- **Hosting:** Netlify
- **Backend:** Netlify Functions (Serverless)
- **Authentication:** Netlify Identity
- **Version Control:** Git/GitHub

---

## Directory Structure

```
/home/user/deltachipurdue/
├── admin/                          # Netlify CMS Admin Interface
│   ├── config.yml                  # CMS configuration
│   └── index.html                  # Admin login page
├── assets/
│   ├── css/
│   │   └── styles.css              # Main stylesheet (181 lines)
│   ├── images/                     # Photos and headshots (18 files, 4.0 MB)
│   │   ├── ian-headshot.jpeg
│   │   ├── jessie-headshot.jpeg
│   │   └── [14 officer photos]
│   └── js/
│       ├── shell.js                # Header/footer & navigation (62 lines)
│       └── app.js                  # Page logic & content loading (347 lines)
├── content/                        # JSON content files
│   ├── events/
│   │   ├── academic.json
│   │   ├── alumni.json
│   │   ├── alumni/
│   │   │   ├── index.json
│   │   │   └── homecoming-tailgate-2025.json
│   │   ├── brotherhood.json
│   │   ├── community-service.json
│   │   ├── fundraising.json
│   │   ├── philanthropy.json
│   │   └── social.json
│   ├── gallery/
│   │   └── index.json
│   ├── donors.json                 # Donor wall entries
│   ├── goals.json                  # Fundraising goals
│   ├── initiatives.json            # Programs by category
│   ├── leadership.json             # Executive board roster
│   └── settings.json               # Site-wide settings
├── netflify/
│   └── functions/
│       └── goal-total.js           # Serverless function for goal totals
├── CODEOWNERS                      # GitHub CODEOWNERS for permissions
├── netlify.toml                    # Netlify configuration
├── index.html                      # Home page
├── about.html                      # About page
├── leadership.html                 # Leadership page
├── events.html                     # Events page
├── initiatives.html                # Initiatives page
├── gallery.html                    # Gallery page
├── alumni.html                     # Alumni page
├── donate.html                     # Donate page
└── contact.html                    # Contact page
```

---

## 1. HTML Pages (Root Directory)

| File | Page | Purpose | Key Features |
|------|------|---------|--------------|
| `index.html` | Home | Landing page | Hero section, values, featured gallery images |
| `about.html` | About | Mission & values | Leadership grid, dynamic roster loading |
| `leadership.html` | Leadership | Executive board | Multi-tab interface (Exec, Recruitment, AMC) |
| `events.html` | Events | Event listings | Category filters, dynamic event rendering |
| `initiatives.html` | Initiatives | Programs | Tabbed organization by category |
| `gallery.html` | Gallery | Photo gallery | Image grid with metadata |
| `alumni.html` | Alumni | Alumni relations | Homecoming 2025, RSVP, calendar export |
| `donate.html` | Donate | Fundraising | Dual donation forms, goals, donor wall |
| `contact.html` | Contact | Contact info | Officer emails and house address |

**Common Features:**
- All pages use Netlify Identity for authentication
- Shared header/footer via `shell.js`
- Page-specific logic via `app.js`
- Responsive design with mobile navigation drawer
- Dynamic content loading from JSON files

---

## 2. JavaScript Files

### `/assets/js/shell.js` (62 lines)
**Purpose:** Shared header/footer and mobile navigation

**Features:**
- Dynamic header with navigation menu
- Admin login button
- Mobile drawer navigation with toggle
- Dynamic footer with auto-updated year
- Navigation array with 7 main pages

---

### `/assets/js/app.js` (347 lines)
**Purpose:** Page-specific dynamic content loading and interactions

**Key Sections:**
1. **Home Page:** Loads up to 4 gallery images for hero section
2. **About Page:** Dynamically populates leadership grid
3. **Leadership Page:** Multi-tab interface with featured leaders (President/VP)
4. **Events Page:** Loads events by category, filter chips, dynamic rendering
5. **Initiatives Page:** Tabbed programs with descriptions
6. **Alumni Page:** RSVP integration, .ics calendar generation
7. **Donate Page:** Dual forms (alumni/family), goals progress bars, donor wall with filters
8. **Shared Features:** Year auto-update, date formatting, JSON loading

**Technologies:** Async/await, Fetch API, DOM manipulation, Event listeners

---

### `/netflify/functions/goal-total.js` (22 lines)
**Purpose:** Netlify serverless function to compute fundraising goal totals

**Features:**
- Returns current amounts from `goals.json`
- Extensible for Stripe/GiveButter API integration
- Environment variable support for API keys

---

## 3. Stylesheets

### `/assets/css/styles.css` (181 lines)
**Purpose:** Single compiled CSS file with all site styling

**Design System:**
- **Colors:** Maroon (#8B0000), Gold (#D4AF37), Ink (#222)
- **Typography:** System fonts (ui-sans-serif, Segoe UI, Roboto)
- **Responsive:** Mobile-first with breakpoints at 950px, 900px, 780px, 640px

**Components:**
- Header/Navigation (sticky, mobile drawer)
- Hero section with gradient background
- Card grids (auto-fit, responsive)
- Event listings with filters and badges
- Gallery (CSS columns layout)
- Donation tabs and forms
- Goal progress bars
- Donor wall (grid layout)
- Leadership layouts (featured, grid, small)
- Footer

**Notable Effects:**
- Glassmorphism effect on header (backdrop-filter blur)
- Smooth transitions and hover effects
- Shadow system for depth
- Flexible grid system

---

## 4. Content Files (JSON)

### Settings & Configuration

**`/content/settings.json`** (18 lines)
```json
{
  "donate": { "url": "...", "url_family": "..." },
  "forms": { "mode": "netlify" },
  "alumni": { "homecoming2025": { "rsvp_url": "..." } }
}
```
- Donation URLs for alumni and family/friends
- Form submission mode (netlify, formspree, disabled)
- Alumni event URLs

---

### Leadership & People

**`/content/leadership.json`** (88 lines)
- 14 leadership members
- Fields: name, role, email, photo
- Roles: President, VP, Secretary, Treasurer, Alumni Relations, Risk Manager, Scholarship Chair, AMC (3), Recruitment Chairs (3), House Mom

---

### Fundraising

**`/content/goals.json`** (21 lines)
- 3 fundraising goals:
  1. International Convention 2026 ($2,500)
  2. Spring Nashville Trip ($5,000)
  3. Basketball Court Renovation ($10,000)

---

### Donors

**`/content/donors.json`** (16 lines)
- Donor wall entries
- Fields: name, type (alumni/family), class_year, related_to, message
- Filtered view by donor type

---

### Events (9 Files)

| File | Category | Purpose |
|------|----------|---------|
| `/content/events/academic.json` | Academic events | Study sessions, workshops |
| `/content/events/alumni.json` | Alumni events | Homecoming, reunions |
| `/content/events/alumni/index.json` | Alumni event index | Event list metadata |
| `/content/events/alumni/homecoming-tailgate-2025.json` | Homecoming details | Specific event data |
| `/content/events/brotherhood.json` | Brotherhood events | Retreats, bonding activities |
| `/content/events/community-service.json` | Service events | Volunteer activities |
| `/content/events/fundraising.json` | Fundraising events | Campaigns, drives |
| `/content/events/philanthropy.json` | Philanthropy events | Charitable activities |
| `/content/events/social.json` | Social events | Parties, gatherings |

**Event Fields:** title, date, location, photo, description, category

---

### Programs & Initiatives

**`/content/initiatives.json`** (14 lines)
- 4 categories with programs:
  - Brotherhood: Retreat & Bonding
  - Community Service: Detrash the Wabash
  - Philanthropy: V Foundation
  - Fundraising: Nashville Trip Goal

---

### Gallery

**`/content/gallery/index.json`** (9 lines)
- Gallery index with file references
- Gallery items contain: photo, title, description

---

## 5. Admin Interface

**`/admin/index.html`** (38 lines)
**Purpose:** CMS admin login and content management interface

**Features:**
- Netlify Identity authentication widget
- Decap CMS (formerly Netlify CMS) integration
- URL-relative paths for Netlify compatibility
- Simple back-to-site navigation

---

**`/admin/config.yml`** (~1.2 KB)
**Purpose:** Netlify CMS configuration

**Collections Defined:**
- Site Settings
- Leadership
- Events (by category)
- Initiatives
- Gallery
- Fundraising Goals
- Donors

---

## 6. Assets

### Images (18 files, 4.0 MB total)

**Headshots (2 featured):**
- `/assets/images/ian-headshot.jpeg` - President Ian Hedges
- `/assets/images/jessie-headshot.jpeg` - House Mom Jessica Richardson

**Officer Photos (16 files):**
- Multiple dated photos (2025-06-27, 2025-04-05)
- Various formats: JPEG
- Used for leadership profiles and hero sections

---

## 7. Configuration Files

### `/netlify.toml` (91 bytes)
**Purpose:** Netlify build and redirect configuration

**Settings:**
- Build command and publish directory
- Redirect rules for single-page app
- Function directory configuration

---

### `/CODEOWNERS` (1.1 KB)
**Purpose:** GitHub CODEOWNERS for branch protection rules

**Defined Roles:**
- President: settings.json, leadership.json, alumni events, gallery
- VP (Aarnav): Same as President
- Alumni Relations: Alumni events, gallery
- Committee Chairs: Respective event categories

---

## 8. Workflow & Access Control

### Content Management Workflow
1. **Edit:** Users log in via `/admin` using Netlify Identity
2. **Save:** Changes are committed to Git via Git Gateway
3. **Deploy:** Netlify automatically rebuilds and deploys
4. **Review:** GitHub PR review process (enforced by CODEOWNERS)

### Role-Based Permissions

| Role | Controlled Files |
|------|------------------|
| President | settings.json, leadership.json, alumni events, gallery |
| VP (Aarnav) | settings.json, leadership.json, alumni events, gallery |
| Alumni Relations | alumni events, gallery |
| Community Service Chair | community-service events |
| Philanthropy Chair | philanthropy events |
| Social Chair | social events |
| Brotherhood Chair | brotherhood events |
| Scholarship Chair | academic events |

---

## 9. Key Features & Functionality

### Donation System
- Dual-track (alumni vs family/friends)
- Integrated with OmegaFi vault system
- Donor wall with public acknowledgments
- Goal tracking with progress bars

### Event Management
- 8 event categories
- Dynamic filtering
- Calendar export (ICS format)
- Date formatting and TBA support

### Leadership Management
- Hierarchical structure (Exec, Recruitment, AMC)
- Role-based sorting
- Featured leaders (President/VP)
- Email contact links

### Alumni Relations
- Homecoming event with RSVP
- Calendar integration
- House location and logistics

### Mobile Responsive
- Mobile navigation drawer
- Responsive grids and layouts
- Breakpoints for tablets and mobile devices

---

## 10. Technical Architecture

### Frontend Stack
- **HTML5** - Semantic markup
- **CSS3** - Modern styling (Grid, Flexbox, Custom Properties)
- **Vanilla JavaScript** - No framework, pure DOM manipulation
- **Fetch API** - JSON loading and form submissions

### CMS & Backend
- **Netlify CMS (Decap CMS)** - Headless CMS
- **Netlify Identity** - User authentication
- **Netlify Functions** - Serverless backend
- **Git Gateway** - Git-based backend for CMS

### Hosting & Deployment
- **Netlify** - Hosting platform
- **Git/GitHub** - Version control and deployment trigger
- **Netlify Forms** - Form submission handling

### Content Architecture
- Static JSON files in `/content` directory
- Loaded dynamically via JavaScript
- Managed through Netlify CMS
- Version controlled in Git

---

## 11. File Summary Statistics

| Category | Count | Size |
|----------|-------|------|
| HTML Pages | 9 | ~50 KB |
| JavaScript | 3 | ~15 KB |
| CSS | 1 | ~8 KB |
| JSON Content | 15 | ~5 KB |
| Admin | 2 | ~2 KB |
| Config | 3 | ~3 KB |
| Images | 18 | 4.0 MB |
| **Total** | **51** | **~4.1 MB** |

---

## 12. Recent Git History

**Current Branch:** `claude/index-files-011CUY9H1eQA19cdmhCsFzNL`

**Recent Commits:**
1. ba1dda4 - Update netlify.toml
2. 52e2031 - Create netlify.toml
3. ecaf275 - Update Site Settings "settings"
4. 83b332e - Update Leadership "leadership"
5. 9f809d4 - Update Fundraising Goals "goals"

---

## 13. Development Notes

### No Build Process
This is a **static site** with no build step. All files are served directly:
- No transpilation (modern ES6+ JavaScript)
- No CSS preprocessing (pure CSS3)
- No bundling (separate script files)
- No image optimization pipeline

### Content Updates
All content updates are made through:
1. **CMS Interface** (`/admin`) - Recommended for non-technical users
2. **Direct JSON Editing** - For developers with Git access
3. **GitHub Web Interface** - For quick edits

### Adding New Content
- **New Event:** Add to appropriate category JSON file
- **New Leader:** Update `leadership.json`
- **New Goal:** Update `goals.json`
- **New Gallery Image:** Update `gallery/index.json` and upload image
- **New Donor:** Update `donors.json`

### Page Structure
Each HTML page follows this pattern:
1. Load `shell.js` for header/footer
2. Load `app.js` for page-specific logic
3. Page-specific `<script>` block runs initialization
4. Dynamic content loads from JSON via Fetch API

---

## Maintenance & Updates

### Regular Updates
- Leadership roster (annually or as needed)
- Event listings (ongoing)
- Gallery images (after events)
- Fundraising goals (quarterly)
- Donor wall (after donations)

### Configuration Updates
- Donation URLs in `settings.json`
- CODEOWNERS when roles change
- CMS config when adding new fields

### Code Updates
- Styling changes in `styles.css`
- Feature additions in `app.js`
- Navigation changes in `shell.js`

---

**End of File Index**
