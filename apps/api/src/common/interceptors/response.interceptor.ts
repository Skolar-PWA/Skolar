import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface PagedPayload<T> {
  data: T;
  meta: Record<string, unknown>;
}

function isPaged<T>(v: unknown): v is PagedPayload<T> {
  if (!v || typeof v !== 'object') return false;
  const rec = v as Record<string, unknown>;
  return 'data' in rec && 'meta' in rec;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(_ctx: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    return next.handle().pipe(
      map((payload) => {
        if (isPaged(payload)) {
          return { success: true, data: payload.data, meta: payload.meta };
        }
        return { success: true, data: payload };
      }),
    );
  }
}
