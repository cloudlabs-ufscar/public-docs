import MemberRoleEnum from "@site/src/data/enums/MemberRoleEnum";
import { IMember } from "@site/src/data/interfaces/IMember";
import { sortMembers } from "../utils";

const constantElements = {
  src: "img/members/",
  role: MemberRoleEnum.UFSCAR_RESEARCHER,
};

export const oldstudents: IMember[] = [
  {
    ...constantElements,
    src: null,
    name: "Sara Ferreira",
    link: "",
  },
  {
    ...constantElements,
    src: null,
    name: "Daniel Kenichi Tiago Tateishi",
    link: "",
  },
  {
    ...constantElements,
    src: null,
    name: "Eric Pereira Queiroz Moreira",
    link: "",
  },
  {
    ...constantElements,
    src: null,
    name: "Gabriel Jesus Dantas",
    link: "",
  },
  {
    ...constantElements,
    src: null,
    name: "Matheus Teixeira Mattioli",
    link: "",
  },
  {
    ...constantElements,
    src: null,
    name: "Miguel Antonio de Oliveira",
    link: "",
  },
  {
    ...constantElements,
    src: constantElements.src + "regis.png",
    name: "Reginaldo Ferreira da Mota Júnior",
    link: "https://oregis.dev.br",
  },
  {
    ...constantElements,
    src: constantElements.src + "augusto.jpeg",
    name: "Augusto dos Santos Gomes Vaz",
    link: "https://github.com/augustodsgv",
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
    name: "Patrícia da Silva Ramos",
    link: "https://www.linkedin.com/in/patr%C3%ADcia-da-silva-ramos-139417212/",
    src: constantElements.src + "patriciaramos.jpeg",
  },
  {
    ...constantElements,
    src: constantElements.src + "rodrigocoffani.jpeg",
    name: "Rodrigo Pavão Coffani Nunes",
    link: "https://github.com/rodcoffani",
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
