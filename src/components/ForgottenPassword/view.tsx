import React from 'react';
import AuthLayout from 'containers/Auth/AuthLayout';

type Props = {
  isLoading: boolean;
  onSubmit: (values: any) => void;
};

const ForgottenPasswordForm = ({ isLoading, onSubmit }: Props) => {

  return (
    <AuthLayout>
      {/* <Form onFinish={onSubmit} layout="vertical">
        <Form.Item
          label={'E-mail'}
          name="email"
          rules={[required, email]}
        >
          <Input
            autoFocus
            placeholder={'E-mail'}
          />
        </Form.Item>
        <Button block type="primary" htmlType="submit" loading={isLoading}>
          {'Submit'}
        </Button>
      </Form> */}
      ForgottenPasswordForm
      {isLoading}  {onSubmit}
    </AuthLayout>
  );
};

export default ForgottenPasswordForm;
