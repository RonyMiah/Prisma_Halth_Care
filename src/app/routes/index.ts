import express from 'express';
import { userRouter } from '../Modules/User/user.route';
import { AdminRouter } from '../Modules/Admin/admin.route';
import { AuthRoutes } from '../Modules/Auth/auth.route';
import { specialtiesRoutes } from '../Modules/Specialties/specialties.route';
import { doctorRoutes } from '../Modules/Doctor/doctor.route';
import { PatientRoutes } from '../Modules/Patient/patient.route';
import { ScheduleRoutes } from '../Modules/Schedulee/schedule.route';
import { DoctorScheduleRoutes } from '../Modules/DoctorSchedule/doctorSchedule.route';
import { AppoinmentRoutes } from '../Modules/Appoinment/appoinment.route';
import { PaymentRouters } from '../Modules/Payment/payment.route';
import { PrescriptionRoutes } from '../Modules/Prescription/prescription.route';
import { ReviewRoutes } from '../Modules/Review/review.route';
import { MetaRoutes } from '../Modules/Meta/meta.route';

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
  {
    path: '/appoinment',
    route: AppoinmentRoutes,
  },
  {
    path: '/payment',
    route: PaymentRouters,
  },
  {
    path: '/prescription',
    route: PrescriptionRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
  {
    path: '/meta',
    route: MetaRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
