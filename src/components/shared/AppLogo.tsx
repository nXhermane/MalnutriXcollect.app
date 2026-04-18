import React from 'react';
import { Image, ImageProps } from 'react-native';

type AppLogoProps = Omit<ImageProps, 'source'>;

const AppLogo: React.FC<AppLogoProps> = React.memo(function (props) {
  return (
    <Image
      source={require('../../../assets/images/malnutix.logo.png')}
      resizeMode="contain"
      {...props}
    />
  );
});

AppLogo.displayName = 'AppLogo';
export { AppLogo };
