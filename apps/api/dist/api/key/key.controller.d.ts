import { NextFunction, Request, Response } from "express";
declare const controller: {
    getPublicKey(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    postPublicKey(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
};
export { controller as keyController };
//# sourceMappingURL=key.controller.d.ts.map