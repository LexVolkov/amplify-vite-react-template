import { randomBytes } from "crypto";
import { createHash } from "crypto";
import { BinaryToTextEncoding } from "crypto";

// Импортируем переменные окружения, где заданы настройки для таблицы и токенов
import { env } from "$amplify/env/api-function";

/**
 * Генерирует одноразовый токен для Custom Auth Flow.
 * Использует crypto.randomBytes для создания случайной строки.
 *
 * @param username - идентификатор пользователя (например, email или уникальный id)
 * @returns сгенерированная строка-токен
 */
export function generateAuthToken(username: string): string {
    const randomData = randomBytes(16).toString("hex"); // 32-символьная строка
    // Создаем HMAC, используя JWT_SECRET в качестве ключа, и хэшируем username + randomData.
    const token = createHmac("sha256", env.JWT_SECRET)
        .update(username + randomData)
        .digest("hex");
    return token.toString();;
}
/**
 * Реализует HMAC (Hash-based Message Authentication Code) для алгоритма SHA-256.
 *
 * Алгоритм:
 * 1. Если длина ключа больше блока (для SHA-256 – 64 байта), заменяем ключ его хэшем.
 * 2. Если длина ключа меньше блока, дополняем его нулями до длины блока.
 * 3. Вычисляем ipad (ключ XOR 0x36) и opad (ключ XOR 0x5c).
 * 4. Вычисляем inner hash: H(ipad || message).
 * 5. Вычисляем итоговый HMAC: H(opad || innerHash).
 *
 * @param algorithm - Название алгоритма (поддерживается "sha256").
 * @param key - Ключ в виде строки или Buffer.
 * @returns Объект с методами update() для добавления данных и digest() для получения хэша.
 */
export function createHmac(algorithm: "sha256", key: string | Buffer) {
    // Для SHA-256 размер блока равен 64 байтам.
    const blockSize = 64;

    // Приводим ключ к Buffer, если это строка.
    let keyBuffer = Buffer.isBuffer(key) ? key : Buffer.from(key);

    // Если ключ длиннее блока, заменяем его хэшем.
    if (keyBuffer.length > blockSize) {
        keyBuffer = createHash(algorithm).update(keyBuffer).digest();
    }

    // Если ключ короче блока, дополняем его нулями.
    if (keyBuffer.length < blockSize) {
        const padded = Buffer.alloc(blockSize, 0);
        keyBuffer.copy(padded);
        keyBuffer = padded;
    }

    // Определяем ipad и opad — буферы, заполненные 0x36 и 0x5c соответственно.
    const ipad = Buffer.alloc(blockSize, 0x36);
    const opad = Buffer.alloc(blockSize, 0x5c);

    // XOR ключа с ipad и opad
    for (let i = 0; i < blockSize; i++) {
        ipad[i] ^= keyBuffer[i];
        opad[i] ^= keyBuffer[i];
    }

    // Создаем внутренний хэш, предварительно обновив его ipad.
    let innerHash = createHash(algorithm).update(ipad);

    return {
        /**
         * Добавляет данные для хэширования.
         *
         * @param data - Данные в виде строки или Buffer.
         * @returns Тот же объект, что позволяет делать цепочку вызовов.
         */
        update(data: string | Buffer) {
            innerHash.update(data);
            return this;
        },
        /**
         * Завершает вычисление HMAC и возвращает итоговый хэш.
         *
         * @param encoding - Формат вывода (например, "hex", "base64"). Если не указан, возвращается Buffer.
         * @returns Итоговый HMAC.
         */
        digest(encoding?: string): string | Buffer {
            // Завершаем внутренний хэш и получаем innerDigest.
            const innerDigest = innerHash.digest();
            // Вычисляем внешний хэш: H(opad || innerDigest)
            const outerHash = createHash(algorithm);
            outerHash.update(opad);
            outerHash.update(innerDigest);

            if (encoding) {
                // Cast to BinaryToTextEncoding, assuming the provided encoding is valid.
                return outerHash.digest(encoding as BinaryToTextEncoding);
            }
            return outerHash.digest();
        }
    };
}
