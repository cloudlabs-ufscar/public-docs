import MemberRoleEnum from "@site/src/data/enums/MemberRoleEnum";
import { IMember } from "@site/src/data/interfaces/IMember";

type IMemberOrder = Record<MemberRoleEnum, number>;

const memberOrder: IMemberOrder = {
  "Colaborador UFSCar": 0,
  "Colaborador LuizaLabs": 1,
  "Pesquisador UFSCar": 2,
  Colaborador: 3,
  Pesquisador: 4,
};

export function sortMembers(a: IMember, b: IMember) {
  if (b.role !== a.role) {
    return memberOrder[a.role] - memberOrder[b.role];
  }
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
}
