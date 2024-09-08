import MemberRoleEnum from "../enums/MemberRoleEnum";

export interface IExMember {
  name: string;
  link: string | null;
  role: MemberRoleEnum;
}
