import crypto from 'crypto';
import HttpCode from '../constants/httpCode';
import HttpErrorMessage from '../constants/httpErrorMessage';
import { CustomError } from '../utils/errorHandling';

class RSAEncryption {
    public static passPhrase = process.env.RSA_PASS_PHRASE + '';
    public static privateKey = process.env.RSA_PRIVATE_KEY + '';
    public static mdHash = process.env.RSA_MESSAGE_DIGEST_HASH + '';

    /* not required but added. */
    public static publicKey = process.env.RSA_PUBLIC_KEY + '';

    public static decrypt(message: string) {
        try {
            const rsaPrivateKey = {
                key: RSAEncryption.privateKey,
                passphrase: RSAEncryption.passPhrase,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: RSAEncryption.mdHash
            };

            const decryptedMessage = crypto.privateDecrypt(
                rsaPrivateKey,
                Buffer.from(message, 'base64')
            );

            return decryptedMessage.toString('utf8');
        } catch (error) {
            throw new CustomError(
                HttpCode.INTERNAL_SERVER_ERROR,
                HttpErrorMessage.RSA_DECRYPT_ERROR
            );
        }
    }
}

export default RSAEncryption;