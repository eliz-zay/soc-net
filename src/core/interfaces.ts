export interface HashedData {
    salt: string;
    hash: string;
}

export interface JwtPayload {
    id: number;
    email: string;
}
