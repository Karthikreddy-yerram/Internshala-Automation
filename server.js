const express = require('express');
const path = require('path');
const { InternshalaAutomation } = require('./index');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Store automation instances
const activeAutomations = new Map();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/start-automation', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const automation = new InternshalaAutomation();
        const sessionId = Date.now().toString();
        
        // Store the automation instance
        activeAutomations.set(sessionId, {
            instance: automation,
            status: 'initializing'
        });

        // Start automation in the background
        automation.initialize()
            .then(() => automation.login(email, password))
            .then(() => automation.searchInternships())
            .then(() => automation.applyToInternships())
            .then(() => {
                const automationData = activeAutomations.get(sessionId);
                if (automationData) {
                    automationData.status = 'completed';
                }
            })
            .catch(error => {
                console.error('Automation error:', error);
                const automationData = activeAutomations.get(sessionId);
                if (automationData) {
                    automationData.status = 'failed';
                    automationData.error = error.message;
                }
            });

        res.json({ 
            message: 'Automation started',
            sessionId
        });
    } catch (error) {
        console.error('Error starting automation:', error);
        res.status(500).json({ message: 'Failed to start automation' });
    }
});

app.get('/automation-status/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const automationData = activeAutomations.get(sessionId);
    
    if (!automationData) {
        return res.status(404).json({ message: 'Automation session not found' });
    }

    res.json({
        status: automationData.status,
        error: automationData.error,
        applicationsSubmitted: automationData.instance.applicationsSubmitted
    });
});

// Cleanup old automation instances
setInterval(() => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [sessionId, data] of activeAutomations.entries()) {
        if (parseInt(sessionId) < oneHourAgo) {
            if (data.instance) {
                data.instance.cleanup();
            }
            activeAutomations.delete(sessionId);
        }
    }
}, 60 * 60 * 1000); // Run every hour

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 