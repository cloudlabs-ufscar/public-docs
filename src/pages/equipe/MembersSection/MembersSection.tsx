import React, { FunctionComponent } from "react";
import { members } from "@site/src/data/content/member/Member";
import MembersGrid from "./MembersGrid/MembersGrid";

const MembersSection: FunctionComponent = () => {
  return (
    <div className="container">
      <MembersGrid members={members.collaborators} title="Orientação" />
      <MembersGrid members={members.students} title="Membros do Grupo" />
    </div>
  );
};

export default MembersSection;
