import { Button } from 'react-login-page';

export const Submit = (props) => {
  const { keyname = 'submit', ...elmProps } = props;

  if (!elmProps.children) {
    elmProps.children = 'Submit';
  }

  return <Button type="submit" keyname={keyname} {...elmProps} />;
};

Submit.displayName = 'Login.Submit';