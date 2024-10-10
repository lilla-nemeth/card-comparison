import { DefaultSVG, OrangeSVG, WhiteSVG } from '../components/atoms/SVGComponents';

export enum LogoVariants {
    orange = 'orange',
    white = 'white',
    default = 'default'
  }
  
  
  export const getSVG = (variant: LogoVariants) => {
    switch (variant) {
      case LogoVariants.orange:
        return OrangeSVG;
      case LogoVariants.white:
        return WhiteSVG;
      default:
        return DefaultSVG;
    }
  };