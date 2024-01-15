import cron from 'node-cron';
import prisma from '../../prisma';
class CronHandler {
  mainCronHandler = async (io: any) => {
    cron.schedule('*/10 * * * * *', async () => {
      const products = await prisma.products.findMany({});

      if (products?.length) {
        products?.forEach((item) => {
          if (item?.quantity <= 5) {
            console.log('cron runs successfully', item);
            // emit a notificattion of low quantity
            io.emit('message', `${item?.itemName} is low in stock`);
          }
        });
      }
    });
  };
}

export default CronHandler;
