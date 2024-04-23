import { Server } from 'http';
import app from './app';

const port = 3000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log('App Listing port on ', port);
  });

  const existHandaller = () => {
    if (server) {
      server.close(() => {
        console.info('Server is Closed !!');
      });
    }
    process.exit(1);
  };

  process.on('uncaughtException', (error) => {
    console.log(error);
    existHandaller();
  });
  process.on('unhandledRejection', (error) => {
    console.log(error);
    existHandaller();
  });
}

main();
