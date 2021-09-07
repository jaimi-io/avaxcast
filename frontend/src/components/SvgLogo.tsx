import { useAppSelector } from "hooks";

interface PropsT {
  lightIcon: string;
  darkIcon: string;
  className?: string;
}

function SvgLogo({ lightIcon, darkIcon, className }: PropsT): JSX.Element {
  const isDark = useAppSelector((state) => state.isDark);
  return <img src={isDark ? darkIcon : lightIcon} className={className} />;
}

export default SvgLogo;
