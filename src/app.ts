import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import httpStatus from 'http-status';
import globalErrorHandaller from './app/middleWares/globalErrorHandaller';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
