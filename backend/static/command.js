const output = document.getElementById('output');

function addOutput(text) {
    output.textContent += '\n> ' + text;
    output.scrollTop = output.scrollHeight;
}

async function healthCheck() {
    addOutput('Running health check...');
    try {
        const response = await fetch('http://localhost:5555/command/health', {
            credentials: 'include'
        });
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
        const response = await fetch('http://localhost:5555/command/users', {
            credentials: 'include'
        });
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
            method: 'POST',
            credentials: 'include'
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
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();
        addOutput(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
    }
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    addOutput('Logging in...');
    try {
        const response = await fetch('http://localhost:5555/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        addOutput(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
    }
}


async function logout() {
    addOutput('Logging out...');
    try {
        const response = await fetch('http://localhost:5555/logout', {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();
        addOutput(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
    }
}

async function seedDB() {
    addOutput('Seeding database...');
    try {
        const response = await fetch('http://localhost:5555/command/seed', {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();
        addOutput(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
    }
}

async function register() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    addOutput('Registering user...');
    try {
        const response = await fetch('http://localhost:5555/register', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        addOutput(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
    }
}

async function showAllData() {
    addOutput('Fetching all database data...');
    try {
        const response = await fetch('http://localhost:5555/command/data', {
            credentials: 'include'
        });
        const data = await response.json();
        addOutput(JSON.stringify(data, null, 2));
    } catch (error) {
        addOutput('ERROR: ' + error.message);
    }
}