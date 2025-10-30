//used for body with request : /channel
export type ChannelBody = {
  name: string;
  channelId: string;
  ownerId: string;
  locked: boolean;
};

export type ChannelResponse = {
  success: boolean;
  token?: string;
  message?: string;
};

export interface ChannelItem {
  PK: string;
  SK: string;
  name: string;
  channelId: string;
  ownerId: string;
  locked: boolean;
}

export interface ChannelIdParam {
  channelId: string;
}

//used for body with request : /registerUser
export type RegisterBody = {
  username: string;
  password: string;
  email?: string;
};

export type RegisterResponse = {
  success: boolean;
  token?: string;
  message?: string;
};

//used for body with request : /registerUser och /login
export interface UserBody {
  username: string;
  password: string;
}

export interface JwtResponse {
  success: boolean;
  token?: string; // JWT
}

// Beskriver user-items från databasen
export interface UserItem {
  PK: string;
  SK: string;
  username: string;
  password: string;
  email?: string;
  accessLevel: string;
  passwordHash: string;
}

export interface UserResponse {
  username: string;
  email?: string;
  userId: string;
  accessLevel: string;
}
export interface UserIdParam {
  userId: string;
}

export interface Payload {
  userId: string;
  accessLevel: string;
}
