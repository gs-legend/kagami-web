import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router';
import { Provider } from 'react-redux';
import history from 'core/history';
import { ConnectedRouter } from 'connected-react-router';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import LoadingScreen from 'components/LoadingScreen/LoadingScreen';
import { store, StorePersistGate } from 'core/store';
import GlobalLoader from 'components/GlobalLoader/GlobalLoader';
import NotFound from 'components/NotFound/NotFound';
import { rootPath } from 'core/config';
import RootLayout from './RootLayout/RootLayout';
import AuthRoutes, { AUTH_ROUTE_PREFIX } from './Auth/routes';

const Root = () => {
    return (
        <ErrorBoundary >
            <Suspense fallback={<LoadingScreen />} >
                <Provider store={store}>
                    <StorePersistGate>
                        <ConnectedRouter history={history}>
                            <GlobalLoader>
                                <Switch>
                                    <Route exact path={rootPath} component={RootLayout} />
                                    <Route path={AUTH_ROUTE_PREFIX} component={AuthRoutes} />
                                    <Route component={NotFound} />
                                </Switch>
                            </GlobalLoader>
                        </ConnectedRouter>
                    </StorePersistGate>
                </Provider>
            </Suspense>
        </ErrorBoundary >
    );
}

export default Root;
