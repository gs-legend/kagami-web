import React from 'react';
import { connect } from 'react-redux';
import { forgottenPasswordAction } from 'core/services/auth/ducks';
import { apiCallIds } from 'core/services/api';
import ForgottenPasswordForm from './view';
import { useTrackProgress } from 'core/services/trackProgress';


const mapDispatchToProps = {
  forgottenPassword: forgottenPasswordAction,
};

type Props = typeof mapDispatchToProps;

const ForgottenPasswordContainer = ({ forgottenPassword }: Props) => {
  const isInProgress = useTrackProgress(apiCallIds.FORGOTTEN_PASSWORD);

  return <ForgottenPasswordForm isLoading={isInProgress} onSubmit={forgottenPassword} />;
};

export default connect(null, mapDispatchToProps)(ForgottenPasswordContainer);
