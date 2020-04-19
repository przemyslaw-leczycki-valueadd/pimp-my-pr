import {
  BitbucketAuthTokenRepository,
  GithubAuthTokenRepository
} from '@pimp-my-pr/server/auth/infrastructure';
import { Platform } from '@pimp-my-pr/shared/domain';
import { GitlabAuthTokenRepository } from './gitlab-auth-token.repository';

export const authTokenRepositoryFactory = (
  githubAuthTokenRepository: GithubAuthTokenRepository,
  bitbucketAuthTokenRepository: BitbucketAuthTokenRepository,
  gitlabAuthTokenTepository: GitlabAuthTokenRepository
) => (platform: Platform) => {
  switch (platform) {
    case Platform.github:
      return githubAuthTokenRepository;

    case Platform.bitbucket:
      return bitbucketAuthTokenRepository;

    case Platform.gitlab:
      return gitlabAuthTokenTepository;

    default:
      throw new Error('No AuthToken repository initialized');
  }
};
