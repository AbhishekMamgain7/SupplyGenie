import { Block } from 'react-login-page';

export const Logo = (props) => {
  const { keyname = 'logo', name = 'logo', ...elmProps } = props;

  if (!elmProps.children) {
    elmProps.children = '⚛️';
  }

  return <Block {...elmProps} keyname={keyname || name} />;
};

Logo.displayName = 'Login.Logo';