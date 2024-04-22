import { userRole, Doctor } from '@prisma/client';
import { IAuthUser } from '../../interfaces/common';
import prisma from '../../../shared/prisma';

const fetchDatabaseMetadata = async (user: IAuthUser) => {
  switch (user?.role) {
    case userRole.SUPPER_ADMIN:
      getSupperAdminData();
      break;
    case userRole.ADMIN:
      getAdminData();
      break;

    case userRole.DOCTOR:
      getDoctorData(user);
      break;
    case userRole.PATIENT:
      getPatientData();
      break;

    default:
      throw new Error('Invalid User Role');
  }
};

const getSupperAdminData = async () => {
  console.log('Supper Admin Data ');
};

//Admin
const getAdminData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenew = await prisma.payment.aggregate({
    _sum: { amount: true },
  });

  console.log(
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenew
  );
};

//Patient
const getPatientData = async () => {
  console.log(' Patient  Data ');
};

//Doctor
const getDoctorData = async (user: IAuthUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ['patientId'],
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenew = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
    },
  });

  const appointmentStatusDristribution = await prisma.appointment.groupBy({
    by: ['status'],
    _count: { id: true },
    where: {
      doctorId: doctorData.id,
    },
  });

  const formattedAppoinmetStatusDistribution =
    appointmentStatusDristribution.map(({ status, _count }) => ({
      status: status,
      count: Number(_count.id),
    }));

  console.dir(formattedAppoinmetStatusDistribution, { depth: 'Iinfinity' });
};

export const MetaServices = {
  fetchDatabaseMetadata,
};
