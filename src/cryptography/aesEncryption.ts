import crypto from 'crypto';
import HttpCode from '../constants/httpCode';
import HttpErrorMessage from '../constants/httpErrorMessage';
import { CustomError } from '../utils/errorHandling';

class AESEncryption {
    public static key = process.env.AES_PRIVATE_KEY + '';
    public static algorithm = (process.env.AES_MODE + '') as crypto.CipherGCMTypes;
    public static IV_LENGTH = +process.env.AES_IV_LENGTH!;

    public static encrypt(message: string) {
        try {
            const iv = crypto.randomBytes(AESEncryption.IV_LENGTH);
            const cipher = crypto.createCipheriv(
                AESEncryption.algorithm,
                Buffer.from(AESEncryption.key, 'hex'),
                iv
            );

            let encrypted = cipher.update(message);
            encrypted = Buffer.concat([encrypted, cipher.final()]);

            const authTag = cipher.getAuthTag();

            return `${iv.toString('hex')}:${encrypted.toString('hex')}:${authTag.toString('hex')}`;
        } catch (error) {
            throw new CustomError(
                HttpCode.INTERNAL_SERVER_ERROR,
                HttpErrorMessage.AES_ENCRYPT_ERROR
            );
        }
    }

    public static decrypt(message: string) {
        try {
            const [iv, encryptedText, authTag] = message
                .split(':')
                .map((part) => Buffer.from(part, 'hex'));
            const decipher = crypto.createDecipheriv(
                AESEncryption.algorithm,
                Buffer.from(AESEncryption.key, 'hex'),
                iv
            );

            decipher.setAuthTag(authTag);

            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return decrypted.toString();
        } catch (error) {
            throw new CustomError(
                HttpCode.INTERNAL_SERVER_ERROR,
                HttpErrorMessage.AES_DECRYPT_ERROR
            );
        }
    }
}

export default AESEncryption;