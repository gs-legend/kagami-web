import { RouterAction } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import createRootReducer from './rootReducer';
import { AuthServiceAction } from 'core/services/auth';
import { AuthAction } from 'core/services/auth/ducks';
import { RoleServiceAction } from 'core/services/kgm/role.service';
import { PresentationServiceAction } from 'core/services/kgm/presentation.service';
import { CacheServiceAction } from 'core/services/kgm/kgm.cache.service';
import { KgmServiceAction } from 'core/services/kgm/kgm.service';
import { ProcessServiceAction } from 'core/services/kgm/process/process.service';
import rootReducer from './rootReducer';
import { store } from './configureStore';

export { store };
export { default as StorePersistGate } from './StorePersistGate';

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;

type RootAction = RouterAction | AuthServiceAction | AuthAction
  | RoleServiceAction | PresentationServiceAction | CacheServiceAction | KgmServiceAction | ProcessServiceAction;

declare module 'typesafe-actions' {
  interface Types {
    RootAction: RootAction;
  }
}

type AppState = ReturnType<typeof rootReducer>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppState = <T extends (state: AppState) => any>(selector: T): ReturnType<T> => useSelector(selector);