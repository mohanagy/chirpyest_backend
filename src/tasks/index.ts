import { getBrandsJob } from './brands';
import { commissionJunctionJob } from './commissionJunction';
import { preparePaymentsJob } from './preparePayments';

const startTasks = (): void => {
  getBrandsJob.start();
  commissionJunctionJob.start();
  preparePaymentsJob.start();
};

export default startTasks;
