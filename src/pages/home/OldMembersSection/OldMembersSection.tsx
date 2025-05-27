import SectionTitle from "@site/src/components/SectionTitle/SectionTitle";
import React, { FunctionComponent } from "react";
import styles from "./OldMembersSection.module.css";
import MembersGrid from "../MembersSection/MembersGrid/MembersGrid";
import { members } from "@site/src/data/content/member/Member";

const OldMembersSectionSection: FunctionComponent = () => {
  return (
    <div className="container">
      <MembersGrid members={members.oldstudents} title="Membros Anteriores" />
    </div>
  );
};

export default OldMembersSectionSection;
