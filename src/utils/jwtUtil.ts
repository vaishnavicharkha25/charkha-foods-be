// import jwt from 'jsonwebtoken';
// import type { TokenPayload, ShorthandTokenPayload, RefreshTokenPayload } from '../types/userData';
// import MiddlewareType from '../constants/middlewareType';

// /* jwt utility methods */
// class JWTUtil {
//     public static secretKey = process.env.JWT_SECRET;

//     public static generateToken = (tokenPayload: TokenPayload) => {
//         try {
//             return jwt.sign(
//                 { ...tokenPayload, type: MiddlewareType.ACCESS_TOKEN },
//                 JWTUtil.secretKey as string,
//                 {
//                     expiresIn: process.env.JWT_TOKEN_EXPIRY
//                 }
//             );
//         } catch (error: any) {
//             throw new Error('Unable to sign token');
//         }
//     };

//     public static generateShorthandToken = (shorthandTokenPayload: ShorthandTokenPayload) => {
//         try {
//             return jwt.sign(
//                 { ...shorthandTokenPayload, type: MiddlewareType.SHORT_HAND_TOKEN },
//                 JWTUtil.secretKey as string,
//                 {
//                     expiresIn: process.env.JWT_SHORT_HAND_TOKEN_EXPIRY
//                 }
//             );
//         } catch (error: any) {
//             throw new Error('Unable to sign token');
//         }
//     };

//     public static generateRefreshToken = (refreshTokenPayload: RefreshTokenPayload) => {
//         try {
//             return jwt.sign(
//                 { ...refreshTokenPayload, type: MiddlewareType.REFRESH_TOKEN },
//                 JWTUtil.secretKey as string,
//                 {
//                     expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY
//                 }
//             );
//         } catch (error: any) {
//             throw new Error('Unable to sign Refresh token');
//         }
//     };
// }

// export default JWTUtil;