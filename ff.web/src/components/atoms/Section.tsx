import module from "@vuo/scss/components/atoms/Section.module.scss";
import { SectionProps } from "@vuo/types/atomProps";

export default function Section({ children }: SectionProps) {
  return <div className={module.container}>{children}</div>;
}
