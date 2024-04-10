import express from 'express';
import { userRouter } from '../Modules/User/user.route';
import { AdminRouter } from '../Modules/Admin/admin.route';
import { AuthRoutes } from '../Modules/Auth/auth.route';
import { specialtiesRoutes } from '../Modules/Specialties/specialties.route';
import { doctorRoutes } from '../Modules/Doctor/doctor.route';
import { PatientRoutes } from '../Modules/Patient/patient.route';
import { ScheduleRoutes } from '../Modules/Schedulee/schedule.route';
import { DoctorScheduleRoutes } from '../Modules/DoctorSchedule/doctorSchedule.route';

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
  {
    path: '/doctor',
    route: doctorRoutes,
  },
  {
    path: '/specialties',
    route: specialtiesRoutes,
  },
  {
    path: '/patient',
    route: PatientRoutes,
  },
  {
    path: '/schedule',
    route: ScheduleRoutes,
  },
  {
    path: '/doctor-schedule',
    route: DoctorScheduleRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
