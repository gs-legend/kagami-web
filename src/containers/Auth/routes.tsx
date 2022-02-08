
import IsAnonymous from 'core/services/auth/guards/IsAnonymous';
import LoginGuard from 'core/services/auth/guards/LoginGuard';
import Login from 'components/Login';
import ForgottenPassword from 'components/ForgottenPassword';
import LogoutGuard from 'core/services/auth/guards/LogoutGuard';
import Logout from 'components/Logout';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

export const AUTH_ROUTE_PREFIX = '/auth';

export const AUTH_ROUTER_PATHS = {
  login: `${AUTH_ROUTE_PREFIX}/login`,
  logout: `${AUTH_ROUTE_PREFIX}/logout`,
  forgottenPassword: `${AUTH_ROUTE_PREFIX}/forgotten-password`
};

export type ResetPasswordParams = {
  passwordResetToken: string;
};

export type ActivateAccountParams = {
  userId: string;
  activationToken: string;
};

const LoginPage = LoginGuard(Login);
const LogoutPage = LogoutGuard(Logout);
const ForgottenPasswordPage = IsAnonymous(ForgottenPassword);

const AuthRoutes = () => (
  <Router>
    <Route exact path={AUTH_ROUTE_PREFIX} render={() => <Redirect to={AUTH_ROUTER_PATHS.login} />} />
    <Route exact path={AUTH_ROUTER_PATHS.login} component={LoginPage} />
    <Route exact path={AUTH_ROUTER_PATHS.logout} component={LogoutPage} />
    <Route exact path={AUTH_ROUTER_PATHS.forgottenPassword} component={ForgottenPasswordPage} />
  </Router>
);

export default AuthRoutes;
