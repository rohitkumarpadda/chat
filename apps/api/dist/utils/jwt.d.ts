import { JWTPayload, IUserDoc } from "interfaces";
import { Response } from "express";
export declare const getJWTPublicKey: () => string;
export declare const getJWTPrivateKey: () => string;
export declare const verifyJWT: (token: string) => JWTPayload;
export declare const issueJWT: ({ user, res }: {
    user: IUserDoc;
    res: Response;
}) => void;
//# sourceMappingURL=jwt.d.ts.map