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

// Används för body vid request: /login och /register
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
