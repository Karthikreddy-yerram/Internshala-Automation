const puppeteer = require("puppeteer");
const { generateCoverLetter } = require("./cover");
const config = require("./config");
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Logger setup
const logger = {
    info: (message) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[INFO] ${timestamp}: ${message}\n`;
        console.log(logMessage);
        fs.appendFileSync(path.join(logsDir, 'application.log'), logMessage);
    },
    error: (message, error) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[ERROR] ${timestamp}: ${message}\n${error ? error.stack : ''}\n`;
        console.error(logMessage);
        fs.appendFileSync(path.join(logsDir, 'error.log'), logMessage);
    }
};

class InternshalaAutomation {
    constructor() {
        this.browser = null;
        this.page = null;
        this.applicationsSubmitted = 0;
    }

    async initialize() {
        try {
            this.browser = await puppeteer.launch(config.browser);
            this.page = await this.browser.newPage();
            
            // Set default timeout
            this.page.setDefaultTimeout(config.application.timeout);
            
            // Add error handling for page
            this.page.on('error', err => {
                logger.error('Page error:', err);
            });

            this.page.on('pageerror', err => {
                logger.error('Page error:', err);
            });

            logger.info('Browser initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize browser:', error);
            throw error;
        }
    }

    async login(email, password) {
        try {
            await this.page.goto("https://internshala.com/", { waitUntil: "networkidle2" });
            logger.info('Navigated to Internshala homepage');

            // Click login button
            await this.page.waitForSelector('button[data-toggle="modal"][data-target="#login-modal"].login-cta');
            await this.page.click('button[data-toggle="modal"][data-target="#login-modal"].login-cta');
            logger.info('Login button clicked');

            // Fill login form
            await this.page.waitForSelector("#modal_email");
            await this.page.type("#modal_email", email, { delay: 100 });
            await this.page.type("#modal_password", password, { delay: 100 });
            logger.info('Credentials entered');

            // Submit login
            await this.page.click("button#modal_login_submit");
            await this.page.waitForNavigation({ waitUntil: "networkidle2" });
            logger.info('Login successful');
        } catch (error) {
            logger.error('Login failed:', error);
            throw error;
        }
    }

    async searchInternships() {
        try {
            // Navigate to internships page
            await this.page.waitForSelector("a.nav-link.dropdown-toggle.internship_link");
            await this.page.click("a.nav-link.dropdown-toggle.internship_link");
            await this.page.waitForNavigation({ waitUntil: "networkidle2" });
            logger.info('Navigated to internships page');

            // Wait for the page to load completely
            await this.page.waitForTimeout(5000);

            // Apply filters
            if (config.searchPreferences.workFromHome) {
                try {
                    // Try multiple selectors for work from home filter
                    const wfhSelectors = [
                        "#work_from_home",
                        "input[type='checkbox'][name='work_from_home']",
                        "label:contains('Work From Home')",
                        ".filter_container input[type='checkbox']"
                    ];

                    for (const selector of wfhSelectors) {
                        const element = await this.page.$(selector);
                        if (element) {
                            await element.click();
                            logger.info('Work from home filter applied');
                            break;
                        }
                    }
                } catch (error) {
                    logger.error('Failed to apply work from home filter:', error);
                }
            }

            if (config.searchPreferences.partTime) {
                try {
                    await this.page.waitForSelector("#part_time", { timeout: 5000 });
                    await this.page.click("#part_time");
                    logger.info('Part-time filter applied');
                } catch (error) {
                    logger.error('Failed to apply part-time filter:', error);
                }
            }

            // Search by profile with retry mechanism
            let retries = 0;
            const maxRetries = 3;
            while (retries < maxRetries) {
                try {
                    await this.page.waitForSelector('input[placeholder*="e.g."]', { timeout: 5000 });
                    const searchInputs = await this.page.$$('input[placeholder*="e.g."]');
                    if (searchInputs.length > 0) {
                        await searchInputs[0].click();
                        await searchInputs[0].type(config.searchPreferences.profile);
                        await this.page.keyboard.press("Enter");
                        logger.info(`Searched for profile: ${config.searchPreferences.profile}`);
                        break;
                    }
                } catch (error) {
                    retries++;
                    if (retries === maxRetries) {
                        logger.error('Failed to enter profile search:', error);
                    }
                    await this.page.waitForTimeout(2000);
                }
            }

            // Search by location if specified
            if (config.searchPreferences.location) {
                try {
                    const locationInputs = await this.page.$$('input[placeholder*="e.g."]');
                    if (locationInputs.length > 1) {
                        await locationInputs[1].click();
                        await locationInputs[1].type(config.searchPreferences.location);
                        await this.page.keyboard.press("Enter");
                        logger.info(`Searched for location: ${config.searchPreferences.location}`);
                    }
                } catch (error) {
                    logger.error('Failed to enter location search:', error);
                }
            }

            // Wait for results to load
            await this.page.waitForTimeout(config.application.delayBetweenActions);
        } catch (error) {
            logger.error('Search failed:', error);
            throw error;
        }
    }

    async applyToInternships() {
        try {
            const internshipContainers = await this.page.$$(
                "div.individual_internship_details.individual_internship_internship"
            );

            if (internshipContainers.length === 0) {
                logger.info('No internships found');
                return;
            }

            for (let index = 0; index < Math.min(internshipContainers.length, config.searchPreferences.maxApplications); index++) {
                try {
                    await this.applyToInternship(internshipContainers[index], index);
                    this.applicationsSubmitted++;
                    logger.info(`Successfully applied to internship ${index + 1}`);
                } catch (error) {
                    logger.error(`Failed to apply to internship ${index + 1}:`, error);
                    continue;
                }
            }
        } catch (error) {
            logger.error('Application process failed:', error);
            throw error;
        }
    }

    async applyToInternship(container, index) {
        await container.click();
        await this.page.waitForTimeout(config.application.delayBetweenActions);

        // Click continue button
        await this.page.waitForSelector("button#continue_button.btn.btn-large");
        await this.page.click("button#continue_button.btn.btn-large");
        await this.page.waitForTimeout(config.application.delayBetweenActions);

        // Fill cover letter
        const coverLetter = generateCoverLetter('fullStack', {
            'Karthik': 'Karthik' // Replace with actual name
        });
        await this.page.waitForSelector("#cover_letter_holder");
        await this.page.click("#cover_letter_holder", { clickCount: 3 });
        await this.page.type("#cover_letter_holder", coverLetter, { delay: 10 });
        logger.info('Cover letter submitted');

        // Handle assessment questions
        await this.handleAssessmentQuestions();
        
        // Submit application
        await this.page.waitForSelector("#submit");
        await this.page.click("#submit");
        logger.info('Application submitted');
    }

    async handleAssessmentQuestions() {
        try {
            const questions = await this.page.$$(".assessment_question");
            logger.info(`Found ${questions.length - 1} assessment questions`);

            for (let i = 1; i < questions.length; i++) {
                const questionText = await this.page.evaluate((el) => {
                    const label = el.querySelector("label");
                    return label ? label.textContent.trim() : "No question text found";
                }, questions[i]);
                
                logger.info(`Processing question ${i}: ${questionText}`);
                
                // Here you can implement custom logic to answer different types of questions
                const answer = await this.generateAnswer(questionText);
                
                const textarea = await this.page.$(`textarea.textarea.form-control:nth-of-type(${i})`);
                if (textarea) {
                    await textarea.focus();
                    await this.page.evaluate((el, text) => {
                        el.value = text;
                        el.dispatchEvent(new Event("input", { bubbles: true }));
                    }, textarea, answer);
                    logger.info(`Answered question ${i}`);
                }
            }
        } catch (error) {
            logger.error('Failed to handle assessment questions:', error);
            throw error;
        }
    }

    async generateAnswer(question) {
        // Implement your answer generation logic here
        // This is a simple example - you might want to make this more sophisticated
        return "I am passionate about technology and eager to learn. I believe my skills and enthusiasm make me a strong candidate for this position.";
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            logger.info('Browser closed');
        }
    }
}

// Export the class instead of running it directly
module.exports = { InternshalaAutomation };
