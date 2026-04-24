import type { UserRole } from '../enums';

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
}

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  email: string | null;
  phone: string | null;
  branchId: string | null;
  schoolGroupId: string | null;
  displayName: string;
  photoUrl: string | null;
}

export interface LoginResponse extends AuthTokens {
  user: AuthenticatedUser;
}

export interface JwtPayload {
  sub: string;
  role: UserRole;
  branchId: string | null;
  schoolGroupId: string | null;
  iat?: number;
  exp?: number;
}
