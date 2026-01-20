/**
 * BACKEND CODE FOR PORTFOLIO - ZERO TRUST ARCHITECTURE
 * 
 * SETUP INSTRUCTIONS:
 * 1. Project Settings > Script Properties:
 *    - Add 'ADMIN_PASSWORD': <Your Secure Password>
 *    - Add 'API_SECRET': <A Random Salt String>
 * 
 * 2. Deploy > New Deployment > Web App > Access: "Anyone"
 */

// --- CONFIGURATION ---
const SCRIPT_PROPS = PropertiesService.getScriptProperties();
const CACHE = CacheService.getScriptCache();
const SESSION_TIMEOUT = 21600; // 6 hours in seconds

const SHEET_NAMES = {
    PROJECTS: "Projects",
    SKILLS: "Skills",
    ACHIEVEMENTS: "Achievements",
    CONTACT: "Contact", // Legacy
    HERO: "Hero",
    SETTINGS: "Settings",
    RESUMES: "Resumes",
    MESSAGES: "Messages" // New Contact System
};

// --- VALIDATION & SANITIZATION ---

const SCHEMAS = {
    [SHEET_NAMES.PROJECTS]: {
        title: (val) => typeof val === 'string' && val.trim().length > 0 && val.length <= 100,
        category: (val) => ['Web', 'Mobile', 'Desktop', 'AI/ML', 'Other'].includes(val)
    },
    [SHEET_NAMES.SKILLS]: {
        name: (val) => typeof val === 'string' && val.trim().length > 0,
        category: (val) => ['Core', 'Frontend', 'Backend', 'Tools', 'Other'].includes(val)
    }
};

function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    // 1. Remove script tags AND their content
    let clean = input.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
    // 2. Remove other HTML tags but keep content (e.g. <b>Bold</b> -> Bold)
    return clean.replace(/<[^>]*>/g, "");
}

function validateItem(sheetName, item, isUpdate = false) {
    const schema = SCHEMAS[sheetName];
    if (!schema) return null; // No schema defined, skip strict validation

    for (const [key, validator] of Object.entries(schema)) {
        // If it's an update, only validate the key if it's present in the payload
        if (isUpdate && !item.hasOwnProperty(key)) continue;

        // If data is present (CREATE or UPDATE with field)
        if (item.hasOwnProperty(key)) {
            if (!validator(item[key])) {
                return `Invalid value for '${key}'. Check constraints.`;
            }
        } else if (!isUpdate) {
            // It's a CREATE action and a required key is missing
            return `Missing required field: '${key}'`;
        }
    }
    return null;
}


// --- CORE ROUTING ---

function doGet(e) {
    // STRICT: doGet is ONLY for simple checks or self-pings. 
    // We prefer POST for everything to avoid caching issues and secure payloads.
    return sendResponse({ status: "alive", message: "Portfolio Backend Online" });
}

function doPost(e) {
    const lock = LockService.getScriptLock();

    try {
        // 1. Parse Request
        if (!e.postData || !e.postData.contents) throw new Error("Invalid Request");
        const request = JSON.parse(e.postData.contents);
        const { action, auth, data, id } = request; // Standardized Payload

        // 2. Public Routes (No Auth Required)
        if (action === "getData") return handleGetData(data);
        if (action === "LOGIN") return handleLogin(data);

        // --- PUBLIC MESSAGE SUBMISSION (Contact Form) ---
        if (action === "sub_msg") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!data.email || !emailRegex.test(data.email)) return sendResponse({ success: false, message: "Invalid email" });
            if (!data.message || data.message.length > 2000) return sendResponse({ success: false, message: "Message too long" });
            if (!data.name) return sendResponse({ success: false, message: "Name required" });

            // Sanitize
            const cleanData = {
                name: sanitizeInput(data.name),
                email: sanitizeInput(data.email),
                message: sanitizeInput(data.message)
            };

            // Generate basic ID/Hash
            const id = Utilities.getUuid();
            const timestamp = new Date().toISOString();
            // Simple hash for anonymous tracking
            const ipHash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, timestamp + Math.random().toString()));

            const sheet = getOrCreateSheet(SpreadsheetApp.getActiveSpreadsheet(), SHEET_NAMES.MESSAGES);

            // Ensure headers
            if (sheet.getLastRow() === 0) sheet.appendRow(['id', 'timestamp', 'name', 'email', 'message', 'status', 'ipHash']);

            sheet.appendRow([id, timestamp, cleanData.name, cleanData.email, cleanData.message, "Unread", ipHash]);
            return sendResponse({ success: true, message: "Message Sent" });
        }

        // 3. SECURE ROUTES - AUTHENTICATION CHECK
        // Request must contain 'auth' token which matches a valid session
        if (!isAuthenticated(auth)) {
            return sendResponse({ success: false, message: "Unauthorized", code: 401 });
        }

        // 4. CRITICAL SECTION - ACQUIRE LOCK (Max wait 10s)
        if (!lock.tryLock(10000)) {
            return sendResponse({ success: false, message: "Server busy, please try again." });
        }

        // 5. Protected Action Routing
        const wb = SpreadsheetApp.getActiveSpreadsheet();
        let result = null;

        switch (action) {
            // Project Operations
            case "addProject": result = crud(wb, SHEET_NAMES.PROJECTS, "CREATE", data); break;
            case "updateProject": result = crud(wb, SHEET_NAMES.PROJECTS, "UPDATE", data, id); break;
            case "deleteProject": result = crud(wb, SHEET_NAMES.PROJECTS, "DELETE", null, id); break;

            // Skill Operations
            case "addSkill": result = crud(wb, SHEET_NAMES.SKILLS, "CREATE", data); break;
            case "updateSkill": result = crud(wb, SHEET_NAMES.SKILLS, "UPDATE", data, id); break;
            case "deleteSkill": result = crud(wb, SHEET_NAMES.SKILLS, "DELETE", null, id); break;

            // Achievement Operations
            case "addAchievement": result = crud(wb, SHEET_NAMES.ACHIEVEMENTS, "CREATE", data); break;
            case "updateAchievement": result = crud(wb, SHEET_NAMES.ACHIEVEMENTS, "UPDATE", data, id); break;
            case "deleteAchievement": result = crud(wb, SHEET_NAMES.ACHIEVEMENTS, "DELETE", null, id); break;

            // Resume Operations
            case "addResume": result = crud(wb, SHEET_NAMES.RESUMES, "CREATE", data); break;
            case "updateResume": result = crud(wb, SHEET_NAMES.RESUMES, "UPDATE", data, id); break;
            case "deleteResume": result = crud(wb, SHEET_NAMES.RESUMES, "DELETE", null, id); break;

            // Settings & Hero
            case "updateSettings": result = updateSingleRowSheet(wb, SHEET_NAMES.SETTINGS, data); break;
            case "updateHero": result = updateSingleRowSheet(wb, SHEET_NAMES.HERO, data); break;

            // File Upload (Drive)
            case "UPLOAD_FILE": result = handleFileUpload(data); break;

            // Admin Management
            case "CHANGE_PASSWORD": result = handleChangePassword(data); break;
            case "updateMessageStatus":
                // data: { status, id }
                result = crud(wb, SHEET_NAMES.MESSAGES, "UPDATE", { status: data.status }, id);
                break;

            default: throw new Error("Unknown Action");
        }

        return sendResponse({ success: true, data: result });

    } catch (error) {
        console.error("Server Error", error);
        return sendResponse({ success: false, message: error.toString() });
    } finally {
        lock.releaseLock();
    }
}

// --- AUTHENTICATION & SECURITY ---

function isAuthenticated(token) {
    if (!token) return false;
    // Check Cache for Session
    const session = CACHE.get(token);
    return session === "VALID";
}

function handleLogin(payload) {
    const storedPass = SCRIPT_PROPS.getProperty("ADMIN_PASSWORD");

    // Hash input and compare
    // Note: In a real "Zero Trust", we'd salt server side. 
    // Here we compare against the stored property directly or hash it if stored hashed.
    // For simplicity with user-friendliness: We assume ADMIN_PASSWORD in props is PLAIN TEXT for user ease,
    // but we strictly validate it here. 

    if (payload.password === storedPass) {
        // Generate Session Token
        const token = Utilities.getUuid();
        // Store in Cache
        CACHE.put(token, "VALID", SESSION_TIMEOUT);
        return sendResponse({ success: true, token: token, expiresIn: SESSION_TIMEOUT });
    }

    return sendResponse({ success: false, message: "Invalid Credentials" });
}

function handleChangePassword(getData) {
    // Already authenticated by middleware
    SCRIPT_PROPS.setProperty("ADMIN_PASSWORD", getData.newPassword);
    return { message: "Password updated" };
}


// --- DATA HANDLERS ---

function handleGetData(data) {
    const wb = SpreadsheetApp.getActiveSpreadsheet();
    const resultData = {
        hero: getSheetData(wb, SHEET_NAMES.HERO),
        projects: getSheetData(wb, SHEET_NAMES.PROJECTS),
        skills: getSheetData(wb, SHEET_NAMES.SKILLS),
        achievements: getSheetData(wb, SHEET_NAMES.ACHIEVEMENTS),
        settings: getSheetData(wb, SHEET_NAMES.SETTINGS),
        resumes: getSheetData(wb, SHEET_NAMES.RESUMES)
    };

    // Check Auth Context for Messages
    // Securely fetch messages only if authenticated
    if (data && data.auth && isAuthenticated(data.auth)) {
        resultData.messages = getSheetData(wb, SHEET_NAMES.MESSAGES);
    }

    return sendResponse({ success: true, data: resultData });
}

function handleFileUpload(data) {
    // data: { name, mimeType, base64, folder? }
    try {
        // 1. Validate MIME Type
        const ALLOWED_MIME_TYPES = [
            "image/png", "image/jpeg", "image/webp", "image/gif",
            "application/pdf", "text/plain"
        ];
        if (!ALLOWED_MIME_TYPES.includes(data.mimeType)) {
            throw new Error(`Invalid file type: ${data.mimeType}. Allowed: Images, PDF, Text.`);
        }

        // 2. Validate Size (Approximate from Base64 length)
        // Base64 is ~1.33x larger than binary. 5MB binary ~= 7MB Base64.
        const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
        const estimatedSize = data.base64.length * 0.75;
        if (estimatedSize > MAX_SIZE_BYTES) {
            throw new Error(`File too large (${(estimatedSize / 1024 / 1024).toFixed(2)}MB). Max 5MB.`);
        }

        // 3. Determine Folder
        let folder;
        if (data.folder) {
            // Find "Portfolio Assets" -> data.folder
            const rootAssets = getOrCreateFolder(DriveApp.getRootFolder(), "Portfolio Assets");
            folder = getOrCreateFolder(rootAssets, data.folder);
        } else {
            folder = DriveApp.getRootFolder();
        }

        const blob = Utilities.newBlob(Utilities.base64Decode(data.base64), data.mimeType, data.name);
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        // Return valid thumbnail URL (more reliable than 'uc' export link)
        return { url: `https://drive.google.com/thumbnail?id=${file.getId()}&sz=w1920` };
    } catch (e) {
        throw new Error("Upload Failed: " + e.message);
    }
}

// Helper for Folder Structure
function getOrCreateFolder(parent, name) {
    const folders = parent.getFoldersByName(name);
    if (folders.hasNext()) {
        return folders.next();
    } else {
        return parent.createFolder(name);
    }
}


// --- CRUD ENGINE ---

function crud(wb, sheetName, action, item, id) {
    // 1. VALIDATION
    if (action === "CREATE" || action === "UPDATE") {
        const error = validateItem(sheetName, item, action === "UPDATE");
        if (error) throw new Error(`Validation Error: ${error}`);

        // 2. SANITIZATION
        for (const key in item) {
            if (typeof item[key] === 'string') {
                item[key] = sanitizeInput(item[key]);
            }
        }
    }

    const sheet = getOrCreateSheet(wb, sheetName);

    // Ensure Headers Exist & Match New Data Keys (Self-Healing)
    let headers = [];
    if (sheet.getLastRow() > 0) {
        headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }

    // Identify missing headers from the input item
    if (item) {
        const itemKeys = Object.keys(item);
        if (!headers.includes("id")) { headers.push("id"); sheet.getRange(1, headers.length).setValue("id"); } // Ensure ID is first/exists

        let newHeadersAdded = false;
        itemKeys.forEach(key => {
            if (!headers.includes(key)) {
                headers.push(key);
                sheet.getRange(1, headers.length).setValue(key); // Append new header
                newHeadersAdded = true;
            }
        });

        // Refetch headers if we modified them
        if (newHeadersAdded && sheet.getLastRow() > 0) {
            headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        }
    }

    // If empty sheet, set headers for the first time
    if (sheet.getLastRow() === 0) {
        if (!headers.includes("id")) headers.unshift("id");
        sheet.appendRow(headers);
    }

    if (action === "CREATE") {
        const row = headers.map(h => {
            if (h === 'id') return item.id || Utilities.getUuid();
            let val = item[h];
            if (typeof val === 'object' && val !== null) return JSON.stringify(val);
            return val;
        });
        sheet.appendRow(row);
        return { message: "Created", id: row[0] };
    }

    const data = sheet.getDataRange().getValues();
    // Assuming ID is Col 1 (Index 0) and corresponds to 'id' header which we ensured is there

    // Find ID column index in case it's not first (though we tried to put it first)
    const idIndex = headers.indexOf("id");
    if (idIndex === -1) return { success: false, message: "Critical: ID Column Missing" };

    if (action === "DELETE") {
        for (let i = 1; i < data.length; i++) {
            if (data[i][idIndex] == id) {
                sheet.deleteRow(i + 1);
                return { message: "Deleted" };
            }
        }
    }

    if (action === "UPDATE") {
        for (let i = 1; i < data.length; i++) {
            if (data[i][idIndex] == id) {
                // Map existing row data
                const existingRow = data[i];
                // Create new row based on headers
                const newRow = headers.map((h, colIndex) => {
                    // If item has this key, update it. Otherwise keep existing.
                    if (item.hasOwnProperty(h)) {
                        let val = item[h];
                        if (typeof val === 'object' && val !== null) return JSON.stringify(val);
                        return val;
                    }
                    // If header is new and didn't exist in old row, return empty string
                    return (colIndex < existingRow.length) ? existingRow[colIndex] : "";
                });

                sheet.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);
                return { message: "Updated" };
            }
        }
    }

    return { success: false, message: "ID Not Found" };
}

function updateSingleRowSheet(wb, sheetName, dataObject) {
    // Sanitize
    for (const key in dataObject) {
        if (typeof dataObject[key] === 'string') {
            dataObject[key] = sanitizeInput(dataObject[key]);
        }
    }

    const sheet = getOrCreateSheet(wb, sheetName);

    // Logic: Row 1 = Headers, Row 2 = Data. Always overwrite Row 2.
    // If headers don't exist, create them.

    let headers = [];
    if (sheet.getLastColumn() > 0) {
        headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }

    // Dynamic Header Check: If new keys exist in dataObject that aren't in headers, add them?
    // For simplicity, we assume headers are fixed or we overwrite.
    // Let's be smart: Re-write headers if needed? No, too risky.
    // Just map existing headers.

    if (headers.length === 0) {
        headers = Object.keys(dataObject);
        sheet.appendRow(headers);
    }

    const row = headers.map(h => {
        let val = dataObject[h];
        if (typeof val === 'object' && val !== null) return JSON.stringify(val);
        return val;
    });

    if (sheet.getLastRow() < 2) {
        sheet.appendRow(row);
    } else {
        sheet.getRange(2, 1, 1, row.length).setValues([row]);
    }

    return { message: "Updated Single Row" };
}

// --- UTILS ---

function getSheetData(wb, sheetName) {
    const sheet = wb.getSheetByName(sheetName);
    if (!sheet) return [];

    const rows = sheet.getDataRange().getValues();
    if (rows.length < 2) return [];

    const headers = rows[0];
    return rows.slice(1).map(row => {
        let obj = {};
        headers.forEach((h, i) => {
            let val = row[i];
            // Try parse JSON wrappers
            if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
                try { val = JSON.parse(val); } catch (e) { }
            }
            obj[h] = val;
        });
        return obj;
    });
}

function getOrCreateFolder(parent, name) {
    const folders = parent.getFoldersByName(name);
    if (folders.hasNext()) {
        return folders.next();
    } else {
        return parent.createFolder(name);
    }
}

function getOrCreateSheet(wb, name) {
    let sheet = wb.getSheetByName(name);
    if (!sheet) {
        sheet = wb.insertSheet(name);
    }
    return sheet;
}

function sendResponse(payload) {
    return ContentService.createTextOutput(JSON.stringify(payload))
        .setMimeType(ContentService.MimeType.JSON);
}
