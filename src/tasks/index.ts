import { getBrandsJob } from './brands';
import { checkPaymentsJob } from './checkPayments';
import { commissionJunctionJob } from './commissionJunction';
import { preparePaymentsJob } from './preparePayments';
import { sendPaymentsJob } from './sendPayments';

const startTasks = (): void => {
  getBrandsJob.start();
  commissionJunctionJob.start();
  preparePaymentsJob.start();
  sendPaymentsJob.start();
  checkPaymentsJob.start();
};

export default startTasks;
