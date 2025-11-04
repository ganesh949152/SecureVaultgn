
const SETTINGS_KEY = 'masterKeyData';
const CREDENTIALS_KEY = 'encryptedCredentials';
let currentMasterPassword = null;

const switchView = (viewId) => {
    document.getElementById('setup-view').classList.add('hidden');
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('vault-view').classList.add('hidden');
    document.getElementById(viewId).classList.remove('hidden');
}

const loadCredentials = async () => {
    const list = document.getElementById('credential-list');
    list.innerHTML = '';
    const result = await chrome.storage.local.get(CREDENTIALS_KEY);
    const encryptedVault = result[CREDENTIALS_KEY] || [];

    if (encryptedVault.length === 0) {
        list.innerHTML = '<li>No passwords saved.</li>';
        return;
    }

    encryptedVault.forEach(item => {
        const decryptedData = window.CryptoFunctions.decryptData(item, currentMasterPassword);
        
        if (decryptedData) {
            const credential = JSON.parse(decryptedData);
            
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Site:</strong> ${credential.site} <br>
                <strong>Username:</strong> ${credential.username} <br>
                <strong>Password:</strong> <span class="pass-hidden">***********</span> 
                <button class="reveal-btn" data-pass="${credential.password}">Reveal</button>
            `;
            list.appendChild(li);
        }
    });
};

const checkState = async () => {
    const result = await chrome.storage.local.get(SETTINGS_KEY);
    
    if (result[SETTINGS_KEY]) {
        switchView('login-view');
    } else {
        switchView('setup-view');
    }
};
document.getElementById('save-master-pass').addEventListener('click', async () => {
    const password = document.getElementById('set-master-pass').value;
    if (password.length < 8) {
        alert("Master password must be at least 8 characters.");
        return;
    }

    const { hash, salt } = window.CryptoFunctions.hashMasterPassword(password);

    await chrome.storage.local.set({ [SETTINGS_KEY]: { hash, salt } });
    alert("Master Password Set Successfully!");
    currentMasterPassword = password;
    switchView('vault-view');
});

document.getElementById('login-button').addEventListener('click', async () => {
    const password = document.getElementById('login-master-pass').value;
    const errorMsg = document.getElementById('login-error');
    errorMsg.textContent = '';
    
    const result = await chrome.storage.local.get(SETTINGS_KEY);
    const { hash, salt } = result[SETTINGS_KEY];
    
    if (window.CryptoFunctions.verifyMasterPassword(password, hash, salt)) {
        currentMasterPassword = password; // Store master pass in session memory
        document.getElementById('login-master-pass').value = '';
        switchView('vault-view');
        await loadCredentials();
    } else {
        errorMsg.textContent = 'Invalid Master Password.';
    }
});
document.getElementById('logout-button').addEventListener('click', () => {
    currentMasterPassword = null;
    switchView('login-view');
});
document.getElementById('password-input').addEventListener('input', (e) => {
    const password = e.target.value;
    const result = zxcvbn(password);
    const strengthMeter = document.getElementById('strength-meter');
    const score = result.score;
    const percentage = (score + 1) * 20; // 20% to 100%

    let color = 'red';
    if (score === 2) color = 'orange';
    if (score >= 3) color = 'green';
    
    strengthMeter.style.width = percentage + '%';
    strengthMeter.style.backgroundColor = color;
    strengthMeter.title = result.feedback.warning || 'No feedback';
});

document.getElementById('generate-pass-btn').addEventListener('click', () => {
    const newPass = window.CryptoFunctions.generateStrongPassword();
    document.getElementById('password-input').value = newPass;
    document.getElementById('password-input').dispatchEvent(new Event('input'));
});

document.getElementById('save-credential-btn').addEventListener('click', async () => {
    const site = document.getElementById('site-name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password-input').value;

    if (!site || !username || !password) {
        alert("Please fill all fields.");
        return;
    }

    const credentialData = JSON.stringify({ site, username, password });

    const encryptedText = window.CryptoFunctions.encryptData(credentialData, currentMasterPassword);
    const result = await chrome.storage.local.get(CREDENTIALS_KEY);
    const currentVault = result[CREDENTIALS_KEY] || [];
    currentVault.push(encryptedText);

    await chrome.storage.local.set({ [CREDENTIALS_KEY]: currentVault });
    alert("Credential saved and encrypted!");
    loadCredentials();
    document.getElementById('site-name').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password-input').value = '';
});

document.getElementById('credential-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('reveal-btn')) {
        const password = e.target.getAttribute('data-pass');
        const hiddenSpan = e.target.previousElementSibling;
        
        hiddenSpan.textContent = password;
        e.target.textContent = 'Hide';
        e.target.onclick = () => {
            hiddenSpan.textContent = '***********';
            e.target.textContent = 'Reveal';
            e.target.onclick = e.target.originalOnClick;
        };
        e.target.originalOnClick = e.target.onclick;
    }
});


checkState();