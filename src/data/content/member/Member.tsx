import { collaborators } from "./collaborator/Collaborator";
import { students } from "./student/Student";

export type MembersType = typeof members;
export const members = { students, collaborators };
