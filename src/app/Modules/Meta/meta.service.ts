import { userRole, Doctor, PaymentStatus } from '@prisma/client';
import { IAuthUser } from '../../interfaces/common';
import prisma from '../../../shared/prisma';

const fetchDatabaseMetadata = async (user: IAuthUser) => {
  let metaData;
  switch (user?.role) {
    case userRole.SUPPER_ADMIN:
      metaData = getSupperAdminData();
      break;
    case userRole.ADMIN:
      metaData = getAdminData();
      break;

    case userRole.DOCTOR:
      metaData = getDoctorData(user);
      break;
    case userRole.PATIENT:
      metaData = getPatientData(user);
      break;

    default:
      throw new Error('Invalid User Role');
  }
  return metaData;
};

const getSupperAdminData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenew = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: PaymentStatus.PAID },
  });

  const barChartData = await getBarChartData();
  const piChartData = await getPieChartData();
  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenew,
    barChartData,
    piChartData,
  };
};

//Admin
const getAdminData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenew = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: PaymentStatus.PAID },
  });

  const barChartData = await getBarChartData();
  const piChartData = await getPieChartData();

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenew,
    barChartData,
    piChartData,
  };
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
      status: PaymentStatus.PAID,
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

  return {
    appointmentCount,
    reviewCount,
    patientCount: patientCount.length,
    totalRevenew,
    formattedAppoinmetStatusDistribution,
  };
};

//Patient
const getPatientData = async (user: IAuthUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentStatusDristribution = await prisma.appointment.groupBy({
    by: ['status'],
    _count: { id: true },
    where: {
      patientId: patientData.id,
    },
  });

  const formattedAppoinmetStatusDistribution =
    appointmentStatusDristribution.map(({ status, _count }) => ({
      status: status,
      count: Number(_count.id),
    }));

  return {
    appointmentCount,
    prescriptionCount,
    reviewCount,
    formattedAppoinmetStatusDistribution,
  };
};

//get BarchartData

const getBarChartData = async () => {
  const appoinmentCountByMonth = await prisma.$queryRaw`
   SELECT DATE_TRUNC('month', "createAt") AS month ,
   CAST(COUNT(*) AS INTEGER) AS count
   FROM "appoinments"
   GROUP BY month
   ORDER BY month ASC
  `;
  return appoinmentCountByMonth;
};

//PieChart Data
const getPieChartData = async () => {
  const appointmentStatusDristribution = await prisma.appointment.groupBy({
    by: ['status'],
    _count: { id: true },
  });

  const formattedAppoinmetStatusDistribution =
    appointmentStatusDristribution.map(({ status, _count }) => ({
      status: status,
      count: Number(_count.id),
    }));

  return formattedAppoinmetStatusDistribution;
};

export const MetaServices = {
  fetchDatabaseMetadata,
};
