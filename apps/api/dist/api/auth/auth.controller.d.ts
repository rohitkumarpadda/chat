import { NextFunction, Request, Response } from "express";
declare const controller: {
    register(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
    protected(req: Request, res: Response, next: NextFunction): Promise<void>;
};
export { controller as authController };
//# sourceMappingURL=auth.controller.d.ts.map