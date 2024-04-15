import axios from 'axios';
import config from '../../config';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { IPaymentData } from './ssl.interface';

const initPayment = async (paymentData: IPaymentData) => {
  //   console.log(paymentData);
  try {
    const data = {
      store_id: config.ssl.storeId,
      store_passwd: config.ssl.storePass,
      total_amount: paymentData.amount,
      currency: 'BDT',
      tran_id: paymentData.transactionId, // use unique tran_id for each api call
      success_url: config.ssl.successUrl,
      fail_url: config.ssl.failUrl,
      cancel_url: config.ssl.cancleUrl,
      ipn_url: 'http://localhost:3030/ipn',
      shipping_method: 'N/A',
      product_name: 'Appoinment.',
      product_category: 'Slip',
      product_profile: 'general',
      cus_name: paymentData.customerName,
      cus_email: paymentData.customerEmail,
      cus_add1: paymentData.customerAddress,
      cus_add2: 'N/A',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: paymentData.customerMobail,
      cus_fax: '01711111111',
      ship_name: 'N/A',
      ship_add1: 'N/A',
      ship_add2: 'N/A',
      ship_city: 'N/A',
      ship_state: 'N/A',
      ship_postcode: 1000,
      ship_country: 'N/A',
    };

    const response = await axios({
      method: 'post',
      url: config.ssl.sslPaymentApi,
      data: data,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment Error Occured !');
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${config.ssl.sslValidationApi}?val_id=${payload.val_id}&store_id=${config.ssl.storeId}&store_passwd=${config.ssl.storePass}&format=json`,
    });
    return response.data;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment Validation Failed'!);
  }
};

export const SSLServices = {
  initPayment,
  validatePayment,
};
