import { useAppSelector } from "hooks";

interface PropsT {
  lightIcon: string;
  darkIcon: string;
  className?: string;
}

/**
 * SVG logo that will change depending on the theme
 * @param props - {@link PropsT}
 * @returns The SvgLogo Component
 */
function SvgLogo({ lightIcon, darkIcon, className }: PropsT): JSX.Element {
  const isDark = useAppSelector((state) => state.isDark);
  return <img src={isDark ? darkIcon : lightIcon} className={className} />;
}

export default SvgLogo;
