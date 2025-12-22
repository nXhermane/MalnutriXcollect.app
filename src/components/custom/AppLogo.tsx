import React from 'react';
import { UIImage, UIImageProps } from './Image';
interface AppLogoProps extends Omit<
  UIImageProps,
  'source' | 'src' | 'alt' | 'resizeMode' | 'sourceDark' | 'sourceLight'
> {
  mode?: 'light' | 'dark';
}
const AppLogo: React.NamedExoticComponent<AppLogoProps> = React.memo(function ({ mode, ...props }) {
  return (
    <UIImage
      sourceDark={require('./../../../assets/images/malnutix.logo.png')}
      sourceLight={require('./../../../assets/images/malnutix.logo.png')}
      alt="MalnutriX collect logo"
      resizeMode={'contain'}
      mode={mode}
      {...props}
    />
  );
});

AppLogo.displayName = 'AppLogo';
export { AppLogo };
