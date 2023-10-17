import { IconName } from './IconName';
import { iconMapping } from './Icons';

const sizes: any = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 28,
  xl: 36,
};

interface IconProps {
  icon: IconName;
  color?: string;
  size?: keyof typeof sizes;
}

export const Icon: any = ({ icon, size = 'md' }: IconProps) => {
  const iconSize: number = sizes[size] || sizes['md'];

  return (
    <svg viewBox='0 0 24 24' preserveAspectRatio='xMidYMid meet' width={iconSize} height={iconSize}>
      {iconMapping[icon]}
    </svg>
  );
};
