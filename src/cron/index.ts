import cron from 'node-cron';
class CronHandler {
  mainCronHandler = async (io: any) => {
    cron.schedule('*/10 * * * * *', () => {
      //   io.emit('message', 'Welcome to the server!');
      console.log('cron runs successfully');
    });
  };
}

export default CronHandler;
