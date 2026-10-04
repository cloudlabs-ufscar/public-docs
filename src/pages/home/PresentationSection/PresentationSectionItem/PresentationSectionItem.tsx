import clsx from "clsx";
import { FunctionComponent } from "react";

import styles from "./PresentationSectionItem.module.css";

interface PresentationSectionItemProps {
  number: string;
  title: string;
  description: string;
}

const PresentationSectionItem: FunctionComponent<
  PresentationSectionItemProps
> = ({ number, title, description }) => {
  return (
    <div className={clsx("col col--3")}>
      <div className={styles.card}>
        <span className={styles.number}>{number}</span>

        <h3>{title}</h3>

        <p>{description}</p>
      </div>
    </div>
  );
};

export default PresentationSectionItem;
