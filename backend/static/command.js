const output = document.getElementById('output');

function addOutput(text) {
    output.textContent += '\n> ' + text;
    output.scrollTop = output.scrollHeight;
}

async function healthCheck() {
    addOutput('Running health check...');
    try {
        const response = await fetch('http://localhost:5555/command/health');
        const data = await response.json();
        addOutput(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
    }
}

async function checkSessions() {
    addOutput('Checking sessions...');
    try {
        const response = await fetch('http://localhost:5555/command/sessions', {
            credentials: 'include'
        });
        const data = await response.json();
        addOutput(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
    }
}

async function showUsers() {
    addOutput('Fetching all users...');
    try {
        const response = await fetch('http://localhost:5555/command/users');
        const data = await response.json();
        addOutput(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
    }
}

async function nukeDB() {
    if (!confirm('⚠️ WARNING: This will delete ALL data! Continue?')) return;
    addOutput('NUKING DATABASE...');
    try {
        const response = await fetch('http://localhost:5555/command/nuke', {
            method: 'POST'
        });
        const data = await response.json();
        addOutput(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
    }
}

async function resetDB() {
    if (!confirm('⚠️ This will delete and recreate all tables! Continue?')) return;
    addOutput('RESETTING DATABASE...');
    try {
        const response = await fetch('http://localhost:5555/command/reset', {
            method: 'POST'
        });
        const data = await response.json();
        addOutput(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
    }
}