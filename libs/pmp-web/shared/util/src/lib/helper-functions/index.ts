import { RepositoryStatistics, UserStatistics } from '@pimp-my-pr/shared/domain';

export function extendRepositoryStatisticsWithApiErrors(
  stats: RepositoryStatistics[] | UserStatistics[]
): RepositoryStatistics[] | UserStatistics[] {
  const statsCopy = JSON.parse(JSON.stringify(stats));

  return statsCopy.map(stat => {
    stat.sumOfHoursPrsWaiting = { value: <number>stat.sumOfHoursPrsWaiting, errors: true };
    return stat;
  });
}
