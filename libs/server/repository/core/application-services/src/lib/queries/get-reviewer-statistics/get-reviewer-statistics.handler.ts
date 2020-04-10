import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  PrRepository,
  RepositoryRepository,
  ReviewerRepository,
  prRepositoryFactoryToken,
  reviewerRepositoryFactoryToken
} from '@pimp-my-pr/server/repository/core/domain-services';
import { repositoryPrsStatisticsReadModelFactory } from '../../read-models/factories/repository-prs-statistics-read-model.factory';
import { GetReviewerStatisticsQuery } from './get-reviewer-statistics.query';
import { ReviewerStatisticsReadModel } from './reviewer-statistics.read-model';
import { Inject } from '@nestjs/common';
import { Platform } from '@pimp-my-pr/shared/domain';
import { PrEntity, ReviewerEntity } from '@pimp-my-pr/server/repository/core/domain';

@QueryHandler(GetReviewerStatisticsQuery)
export class GetReviewerStatisticsHandler
  implements IQueryHandler<GetReviewerStatisticsQuery, ReviewerStatisticsReadModel> {
  constructor(
    @Inject(prRepositoryFactoryToken)
    private prRepositoryFactory: (platform: Platform) => PrRepository,
    @Inject(reviewerRepositoryFactoryToken)
    private reviewerRepositoryFactory: (platform: Platform) => ReviewerRepository,
    private repositoryRepository: RepositoryRepository
  ) {}

  async execute(query: GetReviewerStatisticsQuery): Promise<ReviewerStatisticsReadModel> {
    const prRepository = this.prRepositoryFactory(query.platform);
    const reviewerRepository = this.reviewerRepositoryFactory(query.platform);

    const repositories = await this.repositoryRepository.findAll();
    const reviewer = await reviewerRepository.get(query.reviewerId, query.token);

    const repositoryStatistics = await Promise.all(
      repositories.map(async repository => {
        const prs = await prRepository.findByRepository(repository.fullName, query.token);
        const reviewerPrs = prs.filter(pr => this.isReviewerOfPr(reviewer, pr));

        return repositoryPrsStatisticsReadModelFactory(repository, reviewerPrs);
      })
    );

    return new ReviewerStatisticsReadModel(reviewer, repositoryStatistics);
  }

  private isReviewerOfPr(reviewer: ReviewerEntity, pr: PrEntity): boolean {
    return pr.reviewers.some(prReviewer => prReviewer.id === reviewer.id);
  }
}
