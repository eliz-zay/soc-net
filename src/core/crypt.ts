import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { HashedData } from '.';

export async function hashString(password: string): Promise<HashedData> {
    const salt = crypto.randomBytes(16).toString('hex');
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(
            password, salt, 10000, 512, 'sha512',
            (err, hashBuffer) => err ? reject(err) : resolve({ salt, hash: hashBuffer.toString('hex') })
        );
    });

}

export async function validateHash(password: string, salt: string, hash: string): Promise<boolean> {
    const incomingHash = await new Promise((resolve, reject) => {
        crypto.pbkdf2(
            password, salt, 10000, 512, 'sha512',
            (err, hashBuffer) => err ? reject(err) : resolve(hashBuffer.toString('hex'))
        );
    });

    return hash === incomingHash;
}

export async function signJwt(payload: any, secret: string): Promise<string> {
    return new Promise((resolve, reject) =>
        jwt.sign(payload, secret, (err: Error | null, encoded: string | undefined) => err ? reject(err) : resolve(encoded!))
    );
}

export function encode(text: string) {
    const algorithm = 'aes-256-cbc';

    const cipher = crypto.createCipheriv(
        algorithm,
        process.env.ENCODE_SECRET as string,
        process.env.ENCODE_IV as string
    );

    return Buffer.concat([cipher.update(text), cipher.final()]).toString('hex');
}

export function decode(encoded: string) {
    const algorithm = 'aes-256-cbc';

    const decipher = crypto.createDecipheriv(
        algorithm,
        process.env.ENCODE_SECRET as string,
        process.env.ENCODE_IV as string
    );

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(encoded, 'hex')), decipher.final()]);

    return decrpyted.toString();
}
