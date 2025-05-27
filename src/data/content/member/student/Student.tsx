import MemberRoleEnum from "@site/src/data/enums/MemberRoleEnum";
import { IMember } from "@site/src/data/interfaces/IMember";
import { sortMembers } from "../utils";

const constantElements = {
  src: "img/members/",
  role: MemberRoleEnum.UFSCAR_RESEARCHER,
};

export const students: IMember[] = [
  {
    ...constantElements,
    src: constantElements.src + "gabrieldelucca.jpeg",
    name: "Gabriel de Lucca",
    link: "https://www.linkedin.com/in/gabriel-de-lucca-972994214/",
  },
  {
    ...constantElements,
    src: constantElements.src + "arthursilverio.jpeg",
    name: "Arthur Eugenio Silverio",
    link: "https://github.com/arthunix",
  },
  {
    ...constantElements,
    name: "Vinicius Marques Rodrigues",
    link: "https://www.linkedin.com/in/vinicius-rodrigues-432784105/",
    src: constantElements.src + "viniciusrodrigues.jpeg",
  },
  {
    ...constantElements,
    name: "Gabriel Henrique Alves Zago",
    link: "https://www.linkedin.com/in/gabriel-zago-9920971b4/",
    src: constantElements.src + "gabrielzago.jpeg",
  },
  {
    ...constantElements,
    src: constantElements.src + "lucasquadros.jpeg",
    name: "Lucas Pereira Quadros",
    link: "https://github.com/lucaspquadros",
  },
  {
    ...constantElements,
    src: null,
    name: "Laura Mota Brentano",
    link: "https://www.linkedin.com/in/laura-mota-brentano-5831b6275/",
  },
  {
    ...constantElements,
    src: constantElements.src + "danilosilva.jpeg",
    name: "Danilo da Silva Pinto",
    link: "https://www.linkedin.com/in/danilosp1/",
  },
].sort(sortMembers);
