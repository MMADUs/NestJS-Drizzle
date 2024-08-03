export class User{
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserResponse{
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Session {
  accessToken: string;
  refreshToken: string;
}