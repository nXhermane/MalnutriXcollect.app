import { icons, LucideProps } from 'lucide-react-native';
import { useCSSVariable, withUniwind } from 'uniwind';
export * from './GoogleIcon';

export type IconName = keyof typeof icons;
export type IconProps = { name: IconName } & LucideProps & {
    className?: string;
    sizeClassName?: string;
  };
export const Icon = ({ name, sizeClassName, ...props }: IconProps) => {
  const iconSet = icons as Record<string, React.ComponentType<LucideProps>>;
  const StyledLucide = withUniwind(iconSet[name] || iconSet['AArrowDown']);
  const size = useCSSVariable(`--${sizeClassName || 'text-base'}`);
  return <StyledLucide size={size} {...props} />;
};
