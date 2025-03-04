import { Block } from 'react-login-page';

export const Title = (props) => {
  const { keyname = 'title', name = 'title', ...elmProps } = props;

  if (!elmProps.children) {
    elmProps.children = 'Login';
  }

  return <Block {...elmProps} keyname={keyname || name} />;
};

Title.displayName = 'Login.Title';