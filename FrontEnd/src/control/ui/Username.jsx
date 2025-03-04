import { Input } from 'react-login-page';

export const Username = (props) => {
  const { keyname = 'username', name, rename, ...elmProps } = props;
  const nameBase = name || rename || keyname;
  const key = keyname || name;

  return <Input type="text" index={1} placeholder="Username" {...elmProps} name={nameBase} keyname={key} />;
};

Username.displayName = 'Login.Username';