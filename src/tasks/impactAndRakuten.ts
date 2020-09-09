import { CronJob } from 'cron';
import database from '../database';
import { constants, dto, logger } from '../helpers';
import { rakutenServices, impactRadiusServices, usersServices, cashBackService } from '../services';

const { syncTransactionsCronJobPattern } = constants;

export const impactRadiusRakutenCronJob = new CronJob(
  syncTransactionsCronJobPattern,
  async () => {
    logger.info('impactRadiusRakutenCronJob: Sync transactions cron started');
    const transaction = await database.sequelize.transaction();
    try {
      const rakutenTransactions = await rakutenServices.saveRakutenEventsToDatabase(transaction);
      const impactRadiusTransactions = await impactRadiusServices.saveImpactRadiusActionsToDatabase(transaction);
      logger.info(
        `impactRadiusRakutenCronJob: data rakutenTransactions: ${JSON.stringify(
          rakutenTransactions,
        )} impactRadiusTransactions:${impactRadiusTransactions}`,
      );

      const createdImpactRadiusTransaction = impactRadiusTransactions
        .filter((row: any) => row.dataValues.id)
        .map((row: any) => row.dataValues);
      const createdRakutenTransactionsTransaction = rakutenTransactions
        .filter((row: any) => row.dataValues.id)
        .map((row: any) => row.dataValues);

      const users = await usersServices.findAllUsers(transaction);

      const modifiedData = [...createdImpactRadiusTransaction, ...createdRakutenTransactionsTransaction].map((row) => {
        const modifiedRow = { ...row };
        if (row.userId && Number.isInteger(+row.userId)) {
          const userData = users.find((user) => user.id === row.userId);
          if (!userData) {
            modifiedRow.userId = undefined;
          }
        }
        return modifiedRow;
      });

      logger.info(`impactRadiusRakutenCronJob : modifiedCommissionJunctionData ${JSON.stringify(modifiedData)}`);

      const dataForUpdatingPendingCash = modifiedData.reduce((acc: any, row) => {
        if (row.userId) {
          if (!acc[row.userId]) {
            acc[row.userId] = row.payout || row.commissions;
          } else {
            acc[row.userId] += row.payout || row.commissions;
          }
        }
        return acc;
      }, {});
      logger.info(
        `impactRadiusRakutenCronJob : dataForUpdatingPendingCash ${JSON.stringify(dataForUpdatingPendingCash)}`,
      );

      await Promise.all(
        Object.keys(dataForUpdatingPendingCash).map((userId) => {
          const filter = dto.generalDTO.filterData({ userId });
          return cashBackService.updatePendingCash(
            Number(userId),
            filter,
            dataForUpdatingPendingCash[userId],
            transaction,
          );
        }),
      );
      await transaction.commit();
      logger.info('impactRadiusRakutenCronJob: Sync transactions cron succeeded');
    } catch (error) {
      await transaction.rollback();
      logger.error(
        `impactRadiusRakutenCronJob: Sync transactions cron error: ${
          error.response ? error.response.data.errors : error.message
        }`,
      );
    }
  },
  null,
  true,
  'Etc/UTC',
);
