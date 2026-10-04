import SectionTitle from "@site/src/components/SectionTitle/SectionTitle";
import { IMember } from "@site/src/data/interfaces/IMember";
import React, { FunctionComponent } from "react";
import styles from "./MembersGrid.module.css";
import MemberViewer from "./MemberViewer/MemberViewer";

interface MembersGridProps {
  title: string;
  members: IMember[];
}

const MembersGrid: FunctionComponent<MembersGridProps> = ({
  title,
  members,
}) => {
  return (
    <>
      <SectionTitle>{title}</SectionTitle>
      <div className={styles.list}>
        {members?.map((member, index) => (
          <MemberViewer key={index} {...member} />
        ))}
      </div>
    </>
  );
};

export default MembersGrid;
