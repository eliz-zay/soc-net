export interface HashedData {
    salt: string;
    hash: string;
}

export interface JwtPayload {
    id: number;
    email: string;
    isEmailVerified: boolean;
}

export interface Mail {
    destinationAddresses: string[];
    sourseAddress: string;
    senderName: string;
    subject: string;
    html?: string;
    text?: string;
}
