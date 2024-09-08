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
    src: constantElements.src + "regis.png",
    name: "Reginaldo Ferreira da Mota Júnior",
    link: "https://oregis.dev.br",
  },
  {
    ...constantElements,
    src: constantElements.src + "gabrieldelucca.jpeg",
    name: "Gabriel de Lucca",
    link: "https://www.linkedin.com/in/gabriel-de-lucca-972994214/",
  },
  {
    ...constantElements,
    src: constantElements.src + "augusto.jpeg",
    name: "Augusto dos Santos Gomes Vaz",
    link: "https://github.com/augustodsgv",
  },
  {
    ...constantElements,
    src: constantElements.src + "arthursilverio.jpeg",
    name: "Arthur Eugenio Silverio",
    link: "https://github.com/arthunix",
  },
  {
    ...constantElements,
    name: "Matheus Yuiti Moriy Miata",
    src: constantElements.src + "matheusyuiti.jpeg",
    link: "https://github.com/matheusymm",
  },
  {
    ...constantElements,
    name: "Ivan Capeli Navas",
    src: constantElements.src + "ivancapeli.jpeg",
    link: "https://www.linkedin.com/in/ivan-capeli-navas/",
  },
  {
    ...constantElements,
    name: "Vinicius Marques Rodrigues",
    link: "https://www.linkedin.com/in/vinicius-rodrigues-432784105/",
    src: constantElements.src + "viniciusrodrigues.jpeg",
  },
  {
    ...constantElements,
    name: "Patrícia da Silva Ramos",
    link: "https://www.linkedin.com/in/patr%C3%ADcia-da-silva-ramos-139417212/",
    src: constantElements.src + "patriciaramos.jpeg",
  },
  {
    ...constantElements,
    name: "Gabriel Henrique Alves Zago",
    link: "https://www.linkedin.com/in/gabriel-zago-9920971b4/",
    src: constantElements.src + "gabrielzago.jpeg",
  },
  {
    ...constantElements,
    src: constantElements.src + "rodrigocoffani.jpeg",
    name: "Rodrigo Pavão Coffani Nunes",
    link: "https://github.com/rodcoffani",
  },
  {
    ...constantElements,
    src: constantElements.src + "lucasquadros.jpeg",
    name: "Lucas Pereira Quadros",
    link: "https://github.com/lucaspquadros",
  },
  {
    ...constantElements,
    src: constantElements.src + "andrerettondini.jpeg",
    link: "https://github.com/alrettondini",
    name: "Andre Luis Zitelli Rettondini",
  },
  {
    ...constantElements,
    src: constantElements.src + "leonardoryuiti.jpeg",
    name: "Leonardo Ryuiti Miasiro",
    link: "https://www.linkedin.com/in/leonardo-miasiro-137608241/",
  },
  {
    ...constantElements,
    src: constantElements.src + "igorkenji.jpeg",
    name: "Igor Kenji Kawai Ueno",
    link: "https://www.linkedin.com/in/igor-kkueno/",
  },
  {
    ...constantElements,
    src: null,
    name: "Laura Mota Brentano",
    link: "https://www.linkedin.com/in/laura-mota-brentano-5831b6275/",
  },
  {
    ...constantElements,
    src: constantElements.src + "pedrobaleeiro.jpeg",
    name: "Pedro Freire Baleeiro",
    link: "https://www.linkedin.com/in/pedro-freire-baleeiro/",
  },
  {
    ...constantElements,
    src: constantElements.src + "daniellombardi.png",
    name: "Daniel Lombardi",
    link: "https://www.linkedin.com/in/daniel-lombardi/",
  },
].sort(sortMembers);
