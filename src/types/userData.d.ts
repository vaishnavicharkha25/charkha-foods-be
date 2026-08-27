interface TokenPayload {
    user_id: number;
    role: string;
    sessionId: string;
    email_address: string;
    mobile_number: string;
}

interface ShorthandTokenPayload {
    user_id: number;
    email_address: string;
    mobile_number: string;
}
interface RefreshTokenPayload {
    user_id: number;
    role: string;
    sessionId: string;
    email_address: string;
    mobile_number: string;
}
export { TokenPayload, ShorthandTokenPayload, RefreshTokenPayload };