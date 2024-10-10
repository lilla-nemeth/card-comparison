import { LogoVariants, getSVG } from '../../utils/LogoUtils';

interface LogoProps {
  className?: string;
  variant: LogoVariants;
}

function FixFoodLogo({ className = "", variant = LogoVariants.default }: LogoProps ) {
  return (
    <div className={`fixfood-logo ${className}`}>
      {getSVG(variant)}
    </div>
  );
};

export default FixFoodLogo;