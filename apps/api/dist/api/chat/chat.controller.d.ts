import { NextFunction, Request, Response } from "express";
declare const controller: {
    createConversation(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getConversationList(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMessages(req: Request, res: Response, next: NextFunction): Promise<void>;
    sendMessage(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    editMessage(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
};
export { controller as chatController };
//# sourceMappingURL=chat.controller.d.ts.map