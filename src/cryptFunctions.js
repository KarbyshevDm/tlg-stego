function numberToBytes(num) {
    if (num < 0 || num > 0xFFFFFFFF) {
        throw new RangeError('Число должно быть в диапазоне от 0 до 4294967295 (0xFFFFFFFF)');
    }

    const bytes = new Uint8Array(4);
    bytes[0] = (num >> 24) & 0xFF; // старший байт
    bytes[1] = (num >> 16) & 0xFF;
    bytes[2] = (num >> 8) & 0xFF;
    bytes[3] = num & 0xFF; // младший байт

    return bytes;
}

function bytesToNumber(bytes) {
    if (bytes.length !== 4) {
        throw new RangeError('Массив должен содержать ровно 4 байта');
    }

    let num = 0;
    num |= (bytes[0] & 0xFF) << 24; // старший байт
    num |= (bytes[1] & 0xFF) << 16;
    num |= (bytes[2] & 0xFF) << 8;
    num |= (bytes[3] & 0xFF); // младший байт

    // Приводим к беззнаковому целому числу
    return num >>> 0;
}

async function generateKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );

    return await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

function generateSalt() {
    return window.crypto.getRandomValues(new Uint8Array(16)); // Генерация соли
}

// Функция для шифрования текста
export async function encryptText(data, password) {
    const salt = generateSalt();
    const key = await generateKey(password, salt);
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Генерация вектора инициализации
    const encodedData = new TextEncoder().encode(data);
    
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encodedData
    );

    // Объединяем соль, IV и зашифрованные данные в одну строку
    const combinedArray = new Uint8Array(salt.length + iv.length +4 + encryptedData.byteLength);
    combinedArray.set(salt);
    combinedArray.set(iv, salt.length);
    combinedArray.set(numberToBytes(encryptedData.byteLength), salt.length+iv.length);
    combinedArray.set(new Uint8Array(encryptedData), salt.length + 4 + iv.length);
    return combinedArray;

}

// Функция для дешифрования текста
export async function decryptText(combinedArray, password) {
    // Декодируем строку из Base64
   //const combinedArray = Uint8Array.from(atob(encryptedData64), c => c.charCodeAt(0));
    
    // Извлекаем соль, IV и зашифрованные данные
    const salt = combinedArray.slice(0, 16);
    const iv = combinedArray.slice(16, 28);
    const dataLength = bytesToNumber(combinedArray.slice(28, 32));
    const encryptedData = combinedArray.slice(32,32+dataLength);
    
    const key = await generateKey(password, salt);
    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encryptedData
    );
    return new TextDecoder().decode(decryptedData); // Возвращаем расшифрованный текст
}

