import { isDark$ } from '@/store';
import React, { useMemo } from 'react';
import { Image, ImageProps } from '../ui/image';

interface UIImageProps extends Omit<ImageProps, 'source'> {
  sourceDark: ImageProps['source'];
  sourceLight: ImageProps['source'];
  mode?: 'dark' | 'light';
}

const UIImage: React.FC<UIImageProps> = React.memo(function ({
  sourceDark,
  sourceLight,
  mode,
  ...props
}) {
  const source = useMemo(() => {
    if (mode) {
      return mode === 'dark' ? sourceDark : sourceLight;
    }
    return isDark$.get() ? sourceDark : sourceLight;
  }, [mode, sourceDark, sourceLight]);

  return <Image source={source} {...props} />;
});

UIImage.displayName = 'Image';
export { UIImage, type UIImageProps };
