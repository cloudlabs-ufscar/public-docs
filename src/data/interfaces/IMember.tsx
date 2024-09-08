import MemberRoleEnum from "../enums/MemberRoleEnum";

export interface IMember {
  name: string;
  src: string | null;
  link: string;
  role: MemberRoleEnum;
}
