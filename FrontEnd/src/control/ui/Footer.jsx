import { Block } from 'react-login-page';

export const Footer = (props) => {
  const { keyname = 'footer', name = 'footer', ...elmProps } = props;
  return <Block {...elmProps} name={keyname || name} tagName="footer" />;
};

Footer.displayName = 'Login.Footer';