import { NextFunction, Request, Response } from "express";
import { IBlockUserReq, IUnblockUserReq } from "interfaces";
import UserModel from "./user.model";

export const userController = {
  //Used to get the current user information
  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      if (user) {
        res.json({
          username: user.username,
          name: user.name,
        });
      } else {
        throw new Error("User not found");
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  },

  //Could search by username or email
  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q;
      const projection = { username: 1, name: 1 };

      if (!query || query.toString().trim().length === 0) {
        // Return empty array when no search query is provided for privacy
        return res.json([]);
      }

      // Require minimum 2 characters for search to prevent broad searches
      if (query.toString().trim().length < 2) {
        return res.json([]);
      }

      // Exact username match for maximum privacy (no partial matches)
      const searchResult = await UserModel.find(
        {
          _id: { $ne: req.user!._id },
          username: query.toString().trim() // Exact match, case-sensitive
        },
        projection
      ).limit(5); // Reduced limit since exact match should return 0 or 1 result

      return res.json(searchResult);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  },

  //Block a user
  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId }: IBlockUserReq = req.body;

      if (!userId) {
        return res.status(400).json({
          message: "User ID is required",
        });
      }

      if (userId === req.user!._id.toString()) {
        return res.status(400).json({
          message: "You cannot block yourself",
        });
      }

      //Check if the user exists
      const userToBlock = await UserModel.findById(userId);
      if (!userToBlock) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      //Check if user is already blocked
      const currentUser = await UserModel.findById(req.user!._id);
      if (currentUser?.blockedUsers?.includes(userId as any)) {
        return res.status(400).json({
          message: "User is already blocked",
        });
      }

      //Add user to blocked list
      await UserModel.findByIdAndUpdate(req.user!._id, {
        $addToSet: { blockedUsers: userId },
      });

      res.status(200).json({
        message: "User blocked successfully",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  },

  //Unblock a user
  async unblockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId }: IUnblockUserReq = req.body;

      if (!userId) {
        return res.status(400).json({
          message: "User ID is required",
        });
      }

      //Remove user from blocked list
      await UserModel.findByIdAndUpdate(req.user!._id, {
        $pull: { blockedUsers: userId },
      });

      res.status(200).json({
        message: "User unblocked successfully",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  },

  //Get blocked users list
  async getBlockedUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserModel.findById(req.user!._id)
        .populate("blockedUsers", "username name email")
        .select("blockedUsers");

      res.status(200).json(user?.blockedUsers || []);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  },
};
