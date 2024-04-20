import prisma from '../../../shared/prisma';

import { SSLServices } from '../SSL/ssl.service';
import { AppointmentStatus, PaymentStatus } from '@prisma/client';

const initPayment = async (appoinmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId: appoinmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  //   console.log(paymentData);

  const initPaymentData = {
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    customerName: paymentData.appointment.patient.name,
    customerAddress: paymentData.appointment.patient.address,
    customerEmail: paymentData.appointment.patient.email,
    customerMobail: paymentData.appointment.patient.contactNumber,
  };

  const result = await SSLServices.initPayment(initPaymentData);

  return {
    paymentUrl: result.GatewayPageURL,
  };
};

const validatePayment = async (payload: any) => {
  // amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=boole661987390de79&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=f4dc89c37495935fa36a9fff8bab3051&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id

  //When Deploy Done then you can uncomment

  // if (!payload || !payload.status || !(payload.status === 'VALID')) {
  //   return {
  //     message: 'Invalid Payment',
  //   };
  // }

  // const response = await SSLServices.validatePayment(payload);

  // if (response.status !== 'VALID') {
  //   return {
  //     message: 'Payment Failed !',
  //   };
  // }

  //When Deploy Done then you can comment
  const response = payload;

  await prisma.$transaction(async (tx) => {
    const updatedPaymentData = await tx.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: response,
      },
    });

    await tx.appointment.update({
      where: {
        id: updatedPaymentData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: AppointmentStatus.COMPLETED,
      },
    });
  });

  return {
    message: 'Payment Success !',
  };
};

export const PaymentServices = {
  initPayment,
  validatePayment,
};
