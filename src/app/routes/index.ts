import express from 'express';
import { userRouter } from '../Modules/User/user.route';
import { AdminRouter } from '../Modules/Admin/admin.route';
import { AuthRoutes } from '../Modules/Auth/auth.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/admin',
    route: AdminRouter,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
