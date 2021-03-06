import { createContext, useReducer, useEffect } from 'react';
import { projectAuth } from '../firebase/config';

interface AuthContextInterface {
  user: any;
  authIsReady: boolean;
  authDispatch: React.Dispatch<Action> | any;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

type IState = {
  user: any;
  authIsReady: boolean;
  authDispatch: React.Dispatch<Action>;
};
enum ActionType {
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  AuthIsReady = 'AUTH_IS_READY',
  SetDispatch = 'SET_DISPATCH',
}

type Action = { type: ActionType; payload: any };

export const loginAction: Action = { type: ActionType.Login, payload: null };
export const logoutAction: Action = { type: ActionType.Logout, payload: null };
const authIsReady: Action = { type: ActionType.AuthIsReady, payload: false };
const setDispatch: Action = { type: ActionType.SetDispatch, payload: null };

const initialState: AuthContextInterface = {
  user: null,
  authIsReady: false,
  authDispatch: null,
};

const authReducer = (state: IState, action: Action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_DISPATCH':
      return { ...state, authDispatch: payload };
    case 'LOGIN':
      return { ...state, user: payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'AUTH_IS_READY':
      return { ...state, user: payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  setDispatch.payload = dispatch;

  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged(user => {
      authIsReady.payload = user;
      dispatch(authIsReady);
      unsub();
    });
    if (!state.authDispatch) dispatch(setDispatch);
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
