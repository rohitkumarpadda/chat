import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { userController } from "./user.controller";
const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

//routes that get user info
router.get("/me", userController.getUserInfo);

//route that fuzzy search by username or email
router.get("/search", userController.searchUsers);

//Block a user
router.post("/block", userController.blockUser);

//Unblock a user
router.post("/unblock", userController.unblockUser);

//Get blocked users
router.get("/blocked", userController.getBlockedUsers);

export { router as userRouter };
