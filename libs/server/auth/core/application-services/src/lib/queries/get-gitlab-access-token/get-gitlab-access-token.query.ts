import { IQuery } from '@nestjs/cqrs';

export class GetGitlabAccessTokenQuery implements IQuery {
  constructor(public gitlabCode: string) {}
}
