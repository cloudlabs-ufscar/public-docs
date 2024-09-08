import React, { FunctionComponent } from "react";
import styles from "./ResearchGroupsViewer.module.css";
import ResearchItem from "./ResearchItem/ResearchItem";
import SectionTitle from "@site/src/components/SectionTitle/SectionTitle";
import clsx from "clsx";
import GroupsInfo from "@site/src/data/utils/GroupsInfo";

const ResearchGroupsViewer: FunctionComponent = () => {
  const groupData = GroupsInfo.getGroupsData();

  return (
    <div className={clsx("container", styles.container)}>
      <SectionTitle>Frentes de Pesquisa</SectionTitle>
      <div className="row">
        {groupData?.map(({ description, formattedName, icon, name }, index) => (
          <ResearchItem
            key={index}
            description={description}
            formattedName={formattedName}
            icon={icon}
            name={name}
          />
        ))}
      </div>
    </div>
  );
};

export default ResearchGroupsViewer;
