import { HttpService, Injectable } from '@nestjs/common';
import { AuthTokenEntity } from '@pimp-my-pr/server/auth/core/domain';
import { AuthTokenRepository } from '@pimp-my-pr/server/auth/core/domain-services';
import { PmpApiConfigService } from '@pimp-my-pr/server/shared/core';
import { CoreUnauthorizedFoundException } from '@pimp-my-pr/server/shared/domain';
import { urlFactory } from '@valueadd/typed-urls';
import { map, tap } from 'rxjs/operators';
import { gitlabConfig } from '../../../../../shared/core/src/lib/config/gitlab.config';
import { mapGitlabAuthToken } from '../mappers/map-gitlab-auth-token';
import { GitlabAuthResponse } from '../interfaces/gitlab-auth-response.interface';

@Injectable()
export class GitlabAuthTokenRepository extends AuthTokenRepository {
  endpoints = {
    getAccessToken: urlFactory(gitlabConfig.authUrl)
  };

  constructor(private httpService: HttpService, private configService: PmpApiConfigService) {
    super();
  }

  getAccessToken(gitlabCode: string): Promise<AuthTokenEntity> {
    const githubSecrets = {
      client_id: this.configService.getGitlabClientId(),
      client_secret: this.configService.getGitlabClientSecret(),
      code: gitlabCode,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:4200'
    };

    return this.httpService
      .post<GitlabAuthResponse>(this.endpoints.getAccessToken.url(), githubSecrets)
      .pipe(
        map(res => res.data),
        tap(res => {
          if (res.error) {
            throw new CoreUnauthorizedFoundException(res.error_description || res.error);
          }
        }),
        map(mapGitlabAuthToken)
      )
      .toPromise();
  }
}
