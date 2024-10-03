import React from "react";
import module from "@vuo/scss/components/atoms/Section.module.scss";

interface SectionProps {
  children: React.ReactNode;
}

export default function Section({ children }: SectionProps) {
  return <div className={module.container}>{children}</div>;
}
