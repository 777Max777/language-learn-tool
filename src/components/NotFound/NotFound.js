import { Spacer, Text, Link as LinkNextUI } from '@nextui-org/react';
import classes from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={classes.main}>
      <Text h1 size={40}>
        404
      </Text>
      <Text h2 size={18} weight={'light'}>
        Page not found
      </Text>
      <Spacer />
      <Text size={14} weight={'light'} css={{textAlign: "center"}}>
        If you think this is a mistake, please contact the administrator.
      </Text>
    </div>
  );
};

export default NotFound;
