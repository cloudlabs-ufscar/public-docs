import React, { FunctionComponent, ReactNode } from "react";
import styles from "./SectionTitle.module.css";

interface SectionTitleProps {
  children: ReactNode;
}

const SectionTitle: FunctionComponent<SectionTitleProps> = ({ children }) => {
  return (
    <div className={styles.title}>
      <h2>{children}</h2>
    </div>
  );
};

export default SectionTitle;
