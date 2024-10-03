import { LogoVariants, getSVG } from "../../utils/LogoUtils";
import { LogoProps } from "@vuo/types/atomProps";

function FixFoodLogo({
  className = "",
  variant = LogoVariants.default,
}: LogoProps) {
  return <div className={`fixfood-logo ${className}`}>{getSVG(variant)}</div>;
}

export default FixFoodLogo;
