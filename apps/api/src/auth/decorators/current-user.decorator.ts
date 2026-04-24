import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '@eduportal/shared';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload | undefined => {
    const req = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>();
    return req.user;
  },
);
