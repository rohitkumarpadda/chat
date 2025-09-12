import { NextFunction, Request, Response } from "express";
export declare const userController: {
    getUserInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
    searchUsers(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    blockUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    unblockUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getBlockedUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=user.controller.d.ts.map