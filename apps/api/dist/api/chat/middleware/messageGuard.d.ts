import { NextFunction, Request, Response } from "express";
/**
 * Middleware to check if the user has access to the message
 * Only the sender of the message can edit or delete it
 */
export declare const messageGuard: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=messageGuard.d.ts.map