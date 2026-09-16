import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '@/types';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: UserProfile | null;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: null,
  // Starts as 'checking' — the AuthGuard resolves this on mount by
  // attempting a silent refresh from the persisted refresh token.
  status: 'checking',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    setUnauthenticated(state) {
      state.user = null;
      state.status = 'unauthenticated';
    },
  },
});

export const { setUser, setUnauthenticated } = authSlice.actions;
export default authSlice.reducer;
