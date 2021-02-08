import { Router } from "express";
import { container } from "tsyringe";
import AuthController from "./AuthController";

const getRoutes = (): Router => {
  const router = Router();
  const authController = container.resolve(AuthController);

  const redirectPath = process.env.SPOTIFY_REDIRECT_URI_SUFFIX || "/callback";

  router.get("/auth/url", (req, res) => {
    const url = authController.getAuthUrl(req);
    res.send(url);
  });

  router.get(redirectPath, async (req, res) => {
    const callback = "" + req.query.state;
    await authController.createUserFromCallback(req);
    res.redirect(callback);
  });

  return router;
};

export default getRoutes;
