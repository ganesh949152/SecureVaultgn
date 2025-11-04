
const ITERATIONS = 100000;
const KEY_SIZE = 256 / 32;
const ALGORITHM = 'aes-256-cbc'; 
const SALT_LENGTH = 16;
const IV_LENGTH = 16;


const hashMasterPassword = (password) => {
    const salt = CryptoJS.lib.WordArray.random(SALT_LENGTH);

    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: KEY_SIZE,
        iterations: ITERATIONS
    });

    const hash = CryptoJS.SHA256(key.toString()).toString();

    return {
        hash: hash,
        salt: salt.toString(CryptoJS.enc.Hex)
    };
};

const verifyMasterPassword = (candidatePass, storedHash, storedSalt) => {
    const salt = CryptoJS.enc.Hex.parse(storedSalt);
    const key = CryptoJS.PBKDF2(candidatePass, salt, {
        keySize: KEY_SIZE,
        iterations: ITERATIONS
    });

    const candidateHash = CryptoJS.SHA256(key.toString()).toString();

    return candidateHash === storedHash;
};

const encryptData = (data, masterPass) => {
    const key = CryptoJS.PBKDF2(masterPass, masterPass, {
        keySize: KEY_SIZE,
        iterations: 100
    });

    const iv = CryptoJS.lib.WordArray.random(IV_LENGTH);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
        mode: CryptoJS.mode.CBC,
        iv: iv,
        padding: CryptoJS.pad.Pkcs7
    });

    return iv.toString(CryptoJS.enc.Hex) + ":" + encrypted.toString();
};


const decryptData = (encryptedText, masterPass) => {
    try {
        const parts = encryptedText.split(':');
        const ivHex = parts[0];
        const ciphertext = parts[1];

        if (!ivHex || !ciphertext) {
            throw new Error("Invalid encrypted format");
        }
        
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const key = CryptoJS.PBKDF2(masterPass, masterPass, {
            keySize: KEY_SIZE,
            iterations: 100
        });

        const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
            mode: CryptoJS.mode.CBC,
            iv: iv,
            padding: CryptoJS.pad.Pkcs7
        });
        
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        console.error("Decryption failed:", e);
        return null;
    }
};

const generateStrongPassword = (length = 16) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    const randomArray = new Uint32Array(length);
    window.crypto.getRandomValues(randomArray);

    for (let i = 0; i < length; i++) {
        password += chars[randomArray[i] % chars.length];
    }
    return password;
};

window.CryptoFunctions = {
    hashMasterPassword,
    verifyMasterPassword,
    encryptData,
    decryptData,
    generateStrongPassword
};