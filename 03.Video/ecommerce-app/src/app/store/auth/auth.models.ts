import { User } from "../../core/profile.service";

export interface AuthState {
  user: User | null;
}

export const initialAuthState: AuthState = {
  user: null,
}
