import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { isActionOf } from 'typesafe-actions';

import { RootState } from '.';
import { authServiceReducer, logoutAction } from 'core/services/auth';
import { presentationServiceReducer } from 'core/services/kgm/presentation.service';
import { roleServiceReducer } from 'core/services/kgm/role.service';
import { CacheServiceReducer } from 'core/services/kgm/kgm.cache.service';
import { kgmServiceReducer } from 'core/services/kgm/kgm.service';
import { processServiceReducer } from 'core/services/kgm/process/process.service';
import tabsViewReducer from './tabViewStore';

export default function createRootReducer(history: History): typeof rootReducer {
  const rootReducer = combineReducers({
    authService: authServiceReducer,
    roleService: roleServiceReducer,
    presentationService: presentationServiceReducer,
    cacheService: CacheServiceReducer,
    kgmService: kgmServiceReducer,
    processService: processServiceReducer,
    router: connectRouter(history),
    tabsView: tabsViewReducer,
  });

  return (state, action) =>
    isActionOf(logoutAction, action)
      ? rootReducer(state ? ({ router: state.router } as RootState) : undefined, action)
      : rootReducer(state, action);
}
