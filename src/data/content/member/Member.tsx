import { collaborators } from "./collaborator/Collaborator";
import { students } from "./student/Student";
import { oldstudents } from "./oldstudent/OldStudent";

export type MembersType = typeof members;
export const members = { students, collaborators, oldstudents };
