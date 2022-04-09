import { Role } from "../model";

export interface JwtPayload {
    id: number;
    email: string;
    isEmailVerified: boolean;
    roles: number[];
}
