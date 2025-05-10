require('dotenv').config();

module.exports = {
    // Browser Configuration
    browser: {
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized", "--no-sandbox", "--disable-setuid-sandbox"]
    },

    // Internshala Credentials
    credentials: {
        email: process.env.INTERNSHALA_EMAIL || '',
        password: process.env.INTERNSHALA_PASSWORD || ''
    },

    // Search Preferences
    searchPreferences: {
        profile: "Full Stack Development",
        location: "Bangalore",
        workFromHome: true,
        partTime: false,
        maxApplications: 5
    },

    // Application Settings
    application: {
        delayBetweenActions: 2000,
        maxRetries: 3,
        timeout: 60000
    },

    // Cover Letter Settings
    coverLetter: {
        useCustomTemplate: true,
        customTemplate: null // Will be loaded from cover.js
    }
}; 