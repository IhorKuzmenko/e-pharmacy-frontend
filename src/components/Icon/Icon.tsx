
import type { SVGProps } from 'react';

type IconName =
  | 'youtube'
  | 'star'
  | 'shopping-cart'
  | 'plus'
  | 'phone'
  | 'minus'
  | 'map-pin'
  | 'instagram'
  | 'facebook'
  | 'close-button'
  | 'arrow-right'
  | 'arrow-left';

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

export default function Icon({
  name,
  size = 24,
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}
