import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req: { user: User } = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
