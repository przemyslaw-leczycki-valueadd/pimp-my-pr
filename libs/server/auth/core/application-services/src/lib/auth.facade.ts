import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetBitbucketAccessTokenQuery } from './queries/get-bitbucket-access-token/get-bitbucket-access-token.query';
import { GetGithubAccessTokenQuery } from './queries/get-github-access-token/get-github-access-token.query';
import { AuthTokenReadModel } from './read-models/auth-token/auth-token.read-model';
import { GetGitlabAccessTokenQuery } from './queries/get-gitlab-access-token/get-gitlab-access-token.query';

@Injectable()
export class AuthFacade {
  constructor(private queryBus: QueryBus) {}

  getBitbucketAccessToken(bitbucketCode: string): Promise<AuthTokenReadModel> {
    return this.queryBus.execute(new GetBitbucketAccessTokenQuery(bitbucketCode));
  }

  getGithubAccessToken(githubCode: string): Promise<AuthTokenReadModel> {
    return this.queryBus.execute(new GetGithubAccessTokenQuery(githubCode));
  }

  getGitlabAccessToken(gitlabCode: string): Promise<AuthTokenReadModel> {
    return this.queryBus.execute(new GetGitlabAccessTokenQuery(gitlabCode));
  }
}
