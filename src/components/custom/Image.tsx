import { isDark$ } from '@/store';
import React, { useMemo } from 'react';
import { Image, ImageProps } from '../ui/image';
import { useValue } from '@legendapp/state/react';

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
  const isDark = useValue(isDark$);
  const source = useMemo(() => {
    if (mode) {
      return mode === 'dark' ? sourceDark : sourceLight;
    }
    return isDark ? sourceDark : sourceLight;
  }, [mode, sourceDark, sourceLight, isDark]);

  return <Image source={source} {...props} />;
});

UIImage.displayName = 'Image';
export { UIImage, type UIImageProps };
