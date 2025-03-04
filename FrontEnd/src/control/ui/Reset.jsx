import { Button } from 'react-login-page';

export const Reset = (props) => {
  const { keyname = 'reset', ...elmProps } = props;

  if (!elmProps.children) {
    elmProps.children = 'Reset';
  }

  return <Button type="reset" {...elmProps} keyname={keyname} />;
};

Reset.displayName = 'Login.Reset';