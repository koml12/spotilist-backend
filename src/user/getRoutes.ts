import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import UserController from "./UserController";

const getRoutes = (): Router => {
  const router = Router();
  const userController = container.resolve(UserController);

  router.get("/", async (_req: Request, res: Response) => {
    const users = await userController.getAllUsers();
    return res.status(200).json(users);
  });

  router.get("/:spotifyId", async (req: Request, res: Response) => {
    const user = await userController.getUserBySpotifyId(req);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).send();
    }
  });

  router.delete("/:spotifyId", async (req: Request, res: Response) => {
    await userController.deleteUser(req);
    return res.status(200).send();
  });

  return router;
};

export default getRoutes;
