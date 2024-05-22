import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import httpStatus from 'http-status';
import globalErrorHandaller from './app/middleWares/globalErrorHandaller';
import cookieParser from 'cookie-parser';
import { AppoinmentServices } from './app/Modules/Appoinment/appoinment.service';
import cron from 'node-cron';

const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cron.schedule('* * * * *', () => {
  try {
    AppoinmentServices.cancleUnpaidAppoinments();
  } catch (error) {
    console.error(error);
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send({
    Message: 'Ph Helth Server Running ..',
  });
});

app.use('/api/v1', router);
app.use(globalErrorHandaller);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API NOT FOUND !',
    error: {
      path: req.originalUrl,
      message: 'Your Requested Path Not Found !',
    },
  });
});

export default app;
