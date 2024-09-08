import SectionTitle from "@site/src/components/SectionTitle/SectionTitle";
import React, { FunctionComponent } from "react";
import styles from "./OldMembersSection.module.css";

interface IOldMembersSectionData {
  label: string;
  names: string[];
}

const OldMembersSectionData: IOldMembersSectionData = {
  label: "Membros Anteriores",
  names: [
    "Sara Ferreira",
    "Daniel Kenichi Tiago Tateishi",
    "Eric Pereira Queiroz Moreira",
    "Gabriel Jesus Dantas",
    "Matheus Teixeira Mattioli",
    "Miguel Antonio de Oliveira",
  ].sort(),
};

const OldMembersSectionSection: FunctionComponent = () => {
  return (
    <div className="container">
      <SectionTitle>{OldMembersSectionData.label}</SectionTitle>
      <div className={styles.group}>
        {OldMembersSectionData.names.map((name, index) => (
          <div key={index} className={styles.name}>
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OldMembersSectionSection;
