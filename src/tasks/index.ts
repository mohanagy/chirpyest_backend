import { getBrandsJob } from './brands';
import { checkPaymentsJob } from './checkPayments';
import { commissionJunctionJob } from './commissionJunction';
import { preparePaymentsJob } from './preparePayments';
import { sendPaymentsJob } from './sendPayments';
// import { calcPaymentsCronJob } from './networksPayments';

const startTasks = (): void => {
  getBrandsJob.start();
  commissionJunctionJob.start();
  preparePaymentsJob.start();
  sendPaymentsJob.start();
  checkPaymentsJob.start();
  // calcPaymentsCronJob.start();
};

export default startTasks;
