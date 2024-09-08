import { IMember } from "@site/src/data/interfaces/IMember";
import { UFSCarCollaborators } from "./ufscar/UFSCarCollaborators";
import { LuizaLabsCollaborators } from "./luizalabs/LuizaLabsCollaborators";

export const collaborators: IMember[] = [
  ...LuizaLabsCollaborators,
  ...UFSCarCollaborators,
];
