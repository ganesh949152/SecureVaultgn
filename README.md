🔐 SecureVault Chrome Extension

A Zero-Knowledge Password Manager built on Manifest V3, demonstrating practical cryptography, secure local storage, and real-time security analysis.

This project was developed as a portfolio piece to showcase expertise in front-end security implementation, Chrome Extension architecture, and defensive coding practices.

✨ Features

SecureVault is designed to be a fully self-contained, client-side password management tool, emphasizing security fundamentals:

Master Password Access: The entire vault is protected by a single Master Password.

PBKDF2 Key Derivation: The Master Password is never stored directly. Instead, a key is derived and its strong hash is stored using PBKDF2 (Password-Based Key Derivation Function 2) with a unique salt, drastically increasing security against brute-force attacks.

AES-256 Encryption: All stored credentials (site, username, password) are encrypted using AES-256 in CBC mode, with a unique Initialization Vector (IV) generated and stored alongside the ciphertext.

Real-Time Strength Checking: Integrates zxcvbn (a robust password strength estimator from Dropbox) to provide immediate, actionable feedback on password complexity.

Secure Password Generation: Includes a utility to generate cryptographically secure, high-entropy passwords using the browser's native window.crypto.getRandomValues().

Chrome Storage API: Utilizes the chrome.storage.local API for persistent, secure local storage of the encrypted vault data.

💻 Tech Stack & Security Tools

Component

Technology / Concept

Purpose in Project

Extension Architecture

Manifest V3 (MV3)

Modern Chrome extension standard, focusing on security and service workers.

Logic & UI

JavaScript, HTML, CSS

Core functionality, event handling, and user interface design.

Key Derivation

CryptoJS (PBKDF2, SHA-256)

Hashing the Master Password for authentication.

Data Encryption

CryptoJS (AES-256-CBC)

Encrypting and decrypting the user's saved credentials.

Password Analysis

zxcvbn.js

Provides real-time strength scoring based on entropy and known patterns.

Data Persistence

chrome.storage.local API

Securely storing encrypted data locally within the browser profile.

Security Compliance

Content Security Policy (CSP)

Adherence to MV3 rules by bundling all external scripts locally.

🚀 Installation & Usage

A. Setup

Clone/Download: Download the project files.

Dependencies: Ensure crypto-js.min.js and zxcvbn.js are downloaded and placed in the root directory alongside the other files (as external CDNs are blocked by the extension's strict Content Security Policy).

Open Chrome Extensions: Navigate to chrome://extensions/ in your Chrome browser.

Enable Developer Mode: Toggle the Developer mode switch in the top right corner.

Load Extension: Click Load unpacked and select the project folder containing manifest.json.

B. First Run

Click the SecureVault icon in your browser toolbar.

The initial view will prompt you to Set Master Password. Choose a strong password and save it.

The extension will hash the password and store the hash and salt locally.

C. Operation

Login: Enter your Master Password to unlock the vault. This password is held only in memory (session key) while the vault is open.

<img width="392" height="216" alt="SecureVault1" src="https://github.com/user-attachments/assets/91665d43-1ed0-42d3-8ebd-827babc99cd5" />


Save/Generate: Use the input fields to save a new credential. The embedded strength checker will provide feedback in real-time.

<img width="391" height="414" alt="SecureVault3" src="https://github.com/user-attachments/assets/b7dece37-f361-44b3-9586-a17d208e0c46" />


Encryption: Upon clicking "Save Credential," the data is encrypted using the Master Password and stored in chrome.storage.local.

<img width="472" height="423" alt="SecureVault5" src="https://github.com/user-attachments/assets/182aa264-58de-4dbe-8bdb-22c52dc093d2" />


View: Click the Reveal button next to a stored item to decrypt the password using the session key.

<img width="379" height="457" alt="SecureVault6" src="https://github.com/user-attachments/assets/9a1ff073-c997-42a1-9b5f-9bd70d610902" />


📂 Project Structure

.
├── manifest.json       # Extension configuration (MV3)
├── popup.html          # User Interface (HTML)
├── popup.js            # Main logic, UI handling, and event listeners
├── crypto.js           # Dedicated file for all cryptographic functions
├── crypto-js.min.js    # Locally bundled dependency (AES, PBKDF2)
├── zxcvbn.js           # Locally bundled dependency (Password Strength)
└── icon.png            # Extension icon
