import { getBrandsJob } from './brands';
import { commissionJunctionJob } from './commissionJunction';

const startTasks = (): void => {
  getBrandsJob.start();
  commissionJunctionJob.start();
};

export default startTasks;
