import GroupsEnum from "@site/src/data/enums/GroupsEnum";
import MemberRoleEnum from "@site/src/data/enums/MemberRoleEnum";
import { IMember } from "@site/src/data/interfaces/IMember";

const constantElements = {
  src: "img/members/infra/",
  group: GroupsEnum.INFRASTRUCTURE,
  role: MemberRoleEnum.UFSCAR_COLLABORATOR,
};

export const UFSCarCollaborators: IMember[] = [
  {
    name: "Hélio Crestana Guardia",
    link: "https://cloudlabs.ufscar.br/",
    src: "img/collaborator/ufscar/heliocrestana.jpeg",
    role: MemberRoleEnum.UFSCAR_COLLABORATOR,
  },
  {
    name: "Paulo Matias",
    link: "https://github.com/thotypous",
    src: "img/collaborator/ufscar/paulomatias.jpeg",
    role: MemberRoleEnum.UFSCAR_COLLABORATOR,
  },
];
