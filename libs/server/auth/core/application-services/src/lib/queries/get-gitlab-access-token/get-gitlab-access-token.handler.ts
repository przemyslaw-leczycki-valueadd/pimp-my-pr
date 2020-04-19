import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import {
  AuthTokenRepository,
  authTokenRepositoryFactoryToken
} from '@pimp-my-pr/server/auth/core/domain-services';
import { Platform } from '@pimp-my-pr/shared/domain';
import { AuthTokenReadModel } from '../../read-models/auth-token/auth-token.read-model';
import { GetGitlabAccessTokenQuery } from './get-gitlab-access-token.query';

@QueryHandler(GetGitlabAccessTokenQuery)
export class GetGitlabAccessTokenHandler
  implements IQueryHandler<GetGitlabAccessTokenQuery, AuthTokenReadModel> {
  private authTokenRepository: AuthTokenRepository;

  constructor(
    @Inject(authTokenRepositoryFactoryToken)
    authTokenRepositoryFactory: (platform: Platform) => AuthTokenRepository,
    private jwtService: JwtService
  ) {
    this.authTokenRepository = authTokenRepositoryFactory(Platform.gitlab);
  }

  async execute(query: GetGitlabAccessTokenQuery): Promise<AuthTokenReadModel> {
    const { token } = await this.authTokenRepository.getAccessToken(query.gitlabCode);

    const jwtPayload = {
      token,
      platform: Platform.gitlab
    };

    const jwtToken = await this.jwtService.signAsync(jwtPayload);

    return { token: jwtToken };
  }
}
