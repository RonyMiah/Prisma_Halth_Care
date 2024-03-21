import express from 'express';
import { userRouter } from '../Modules/User/user.route';
import { AdminRouter } from '../Modules/Admin/admin.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
