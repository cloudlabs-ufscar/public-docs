import GroupsEnum from "@site/src/data/enums/GroupsEnum";
import MemberRoleEnum from "@site/src/data/enums/MemberRoleEnum";
import { IMember } from "@site/src/data/interfaces/IMember";

export const LuizaLabsCollaborators: IMember[] = [
  {
    name: "Alcides Mignoso e Silva",
    link: "https://www.linkedin.com/in/alcidesmig/",
    src: "img/collaborator/LLabs/alcides.jpeg",
    role: MemberRoleEnum.LUIZALABS_COLLABORATOR,
    group: [GroupsEnum.INFRASTRUCTURE, GroupsEnum.SRE],
  },
];
