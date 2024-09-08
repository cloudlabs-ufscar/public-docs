import clsx from "clsx";
import React, { FunctionComponent } from "react";
import styles from "./ResearchItem.module.css";
import { GroupData } from "@site/src/data/utils/GroupsInfo";

interface ResearchItemProps extends GroupData {}

const ResearchItem: FunctionComponent<ResearchItemProps> = ({
  name,
  formattedName,
  icon: Svg,
  description,
}) => {
  return (
    name && (
      <div className={clsx("col col--4")}>
        <div className="text--center">
          <Svg className={styles.icon} role="img" />
        </div>
        <div className="text--center padding-horiz--md">
          <h3>{formattedName.toUpperCase()}</h3>
          <p className={styles.center}>{description}</p>
        </div>
      </div>
    )
  );
};

export default ResearchItem;
