# Project Architecture & Health Report

## 1. Backend Structure & Flow (Google Apps Script)

The backend is built on **Google Apps Script (GAS)**, acting as a "Serverless" API and Database (using Google Sheets). It fundamentally operates on a **Single-Endpoint Architecture**.

### **Core Flow**
1.  **Request Entry (`doPost`)**:
    -   All communications (GET data, POST data, mutations) happen via HTTP `POST` requests to the GAS Web App URL.
    -   The script parses the payload structure: `{ action, auth, data, id }`.

2.  **Security Layer**:
    -   **Authentication**: Checks the `auth` token against `CacheService`. Tokens are generated upon login and stored in `ScriptCache` for 6 hours (`SESSION_TIMEOUT`).
    -   **LockService**: A `ScriptLock` is acquired immediately for mutations to prevent race conditions (two users writing to the same cell simultaneously).

3.  **Routing & Logic**:
    -   A `switch(action)` block routes requests to specific handlers (e.g., `crud`, `handleFileUpload`, `updateSettings`).
    -   **CRUD Engine**: A generic `crud()` function handles repetitive CREATE/UPDATE/DELETE operations.
        -   It dynamically reads headers from the target Sheet.
        -   It maps JSON keys to Column Headers (Self-Healing Schema: if a column is missing, it adds it).

4.  **Database (Google Sheets)**:
    -   Data is stored in specific tabs defined in `SHEET_NAMES` (e.g., "Projects", "Skills").
    -   Row structure: Row 1 = Headers, Rows 2+ = Data.
    -   **Zero Trust**: All inputs are sanitized (`sanitizeInput`) to strip HTML/Script tags before writing to cells.

### **File Upload Flow**
1.  Frontend converts file to **Base64** string.
2.  Payload sent to GAS `UPLOAD_FILE` action.
3.  GAS decodes Base64 -> Blob.
4.  Blob is saved to **Google Drive** using `DriveApp`.
5.  A publicly accessible thumbnail URL is returned and stored in the Sheet.

---

## 2. Project Layer Interaction

The frontend is a **React Application** structured in three distinct layers that enforce separation of concerns.

### **Layer 1: Service Layer (`src/shared/services`)**
-   **Responsibility**: Raw API communication.
-   **Key File**: `googleSheets.ts`.
-   **Interaction**:
    -   Takes raw data from the app.
    -   Injects Authentication Token from `authService`.
    -   Formats the payload for GAS (`action` + `data`).
    -   Handles HTTP `fetch` and JSON parsing.
    -   **Abstraction**: The rest of the app doesn't know it's talking to Google Sheets; it just calls `postData`.

### **Layer 2: State Management / Context (`src/shared/context`)**
-   **Responsibility**: Business Logic & Global State.
-   **Key File**: `PortfolioContext.tsx`.
-   **Interaction**:
    -   Calls Service Layer to fetch initial data (`refreshData`).
    -   **Optimistic Updates**: When you "Delete" a project, it creates a new local state array *immediately* (UI updates instantly) before the API call finishes. If the API fails, it logs an error (and ideally should revert).
    -   Exposes simple methods (`addProject`, `markMessageRead`) to the components.

### **Layer 3: View Layer (Components & Pages)**
-   **Responsibility**: UI Rendering & User Interaction.
-   **Structure**:
    -   `src/public`: Public-facing portfolio (ReadOnly). Reads from Context.
    -   `src/admin`: Authenticated CMS (Read/Write). Calls Context methods.
    -   **Shared Components**: `Inputs.tsx`, `ImageUploader.tsx`. These are "dumb" components that just receive props and emit events.

---

## 3. Project Structure & Code Organization

The codebase follows a **Feature-First** + **Shared Core** organization method.

```
src/
├── admin/                  # [Secure] Admin Panel Logic
│   ├── components/         # Admin-specific UI (AdminInbox, DashboardStats)
│   │   └── ui/             # Reusable Atoms (Input, Select, TitleInput)
│   └── pages/              # Route Pages (Dashboard, Projects, Skills)
│
├── public/                 # [Public] Visitor Pages
│   ├── components/         # Portfolio Sections (Hero, Work, Contact)
│   └── pages/              # LandingPage
│
├── shared/                 # [Core] Shared Logic
│   ├── context/            # Global State (PortfolioContext)
│   ├── services/           # External API Implementations (googleSheets, auth)
│   └── utils/              # Helpers (imageCompressor)
│
├── App.tsx                 # Main Routing (Private vs Public Routes)
└── main.tsx                # Entry Point
```

### **Required Paths & Key Locations**
1.  **Backend Script**: `google-apps-script.js` (Root directory).
2.  **API Service**: `src/shared/services/googleSheets.ts` (API Gateway).
3.  **Global Data Store**: `src/shared/context/PortfolioContext.tsx`.
4.  **Admin UI**: `src/admin/pages/*` (Where CMS logic lives).

---

## 4. Issues & Health Check

Below is a comprehensive list of issues, bugs, and technical debt identified during the analysis.

### **Critical / Functional Issues**
1.  **Implicit `any` Types**:
    -   **Severity**: High
    -   **Location**: `PortfolioContext.tsx`, `ProjectsPage.tsx`, `AdminInbox.tsx`.
    -   **Risk**: The TypeScript configuration is loose. Many variables are typed as `any`, bypassing type safety which can lead to runtime crashes if API responses change unexpectedly.
2.  **Mobile Responsiveness (Addressed)**:
    -   **Severity**: Low (Recently fixed)
    -   **Location**: `AdminInbox.tsx`, `Stats Cards`.
    -   **Analysis**: Recent refactors have stabilized the mobile view for Projects, Content, and Messages. Requires verification on `DashboardPage`.
3.  **Hardcoded Sheet Names**:
    -   **Severity**: Medium
    -   **Location**: `google-apps-script.js` vs Frontend.
    -   **Risk**: If a user renames a tab in Google Sheets manually, the entire backend breaks. The system relies on precise string matching.

### **UI/UX Issues**
4.  **Admin Inbox Mobile View**:
    -   **Status**: **Fixed**. Fully refactored to match standard mobile email app patterns (Avatars, Sender Header, Clean List).
5.  **Padding Inconsistency**:
    -   **Status**: **Fixed**. Standardized to `px-4` (Mobile) and `md:px-8` (Desktop) across all admin pages.

### **Performance & Limitations**
6.  **File Upload Limits**:
    -   **Limitation**: Google Apps Script memory limit is ~50MB. Base64 encoding increases size by ~33%.
    -   **Insight**: Uploading files larger than 5MB is artificially restricted in the script to ensure stability. Large video files cannot be hosted this way.
7.  **Optimistic UI Reversion**:
    -   **Insight**: In `PortfolioContext.tsx`, if `handleCRUD` fails at the API level, the error is logged `console.error` but the local state **is not automatically reverted**. This means the UI might show a "Deleted" project that actually persists on reload.

---

## 5. Hosting Compatibility: GitHub Pages

**Verdict: YES, Fully Compatible.**

Since the backend logic is entirely decoupled (hosted on Google Apps Script), the frontend is purely a **Static React SPA**. GitHub Pages is an excellent, free choice for hosting this project.

### **Configuration Required for GitHub Pages Deployment**

1.  **Client-Side Routing Fix (Critical)**:
    -   **Problem**: GitHub Pages is a static server. Accessing a sub-route like `https://your-site.com/admin` directly will cause a **404 Error** because the file `admin/index.html` does not physically exist.
    -   **Solutions**:
        -   **Option A (Easiest)**: Switch to `HashRouter` in `src/main.tsx`. URLs will look like `/#/admin`. This works out of the box.
        -   **Option B (Cleaner URLs)**: Keep `BrowserRouter` but add a `404.html` file to your `public` folder that contains a script to redirect the query path to `index.html`.

2.  **Base URL (Vite Config)**:
    -   **Repository Site**: If hosting at `username.github.io/repo-name`, you **MUST** set `base: "/repo-name/"` in `vite.config.ts`.
    -   **User Site**: If hosting at `username.github.io`, the default `base: "/"` is correct.

3.  **Environment Variables**:
    -   The `VITE_GOOGLE_SCRIPT_URL` must be injected during the build.
    -   **How**: In your GitHub Actions workflow, add the secret to the build step:
        ```yaml
        - name: Build
          run: npm run build
          env:
            VITE_GOOGLE_SCRIPT_URL: ${{ secrets.VITE_GOOGLE_SCRIPT_URL }}
        ```
