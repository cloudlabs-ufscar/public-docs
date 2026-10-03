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
    src: constantElements.src + "eduardopereira.jpg",
    name: "Eduardo Pereira Filho",
    link: "https://www.linkedin.com/in/eduardo-pereira-filho-2397671b8/",
  },
  {
    ...constantElements,
    src: constantElements.src + "nicolasqueiroz.jpg",
    name: "Nicolas Queiroz Bertozzo",
    link: "https://www.linkedin.com/in/nqber/",
  },
  {
    ...constantElements,
    src: constantElements.src + "murilomiranda.jpg",
    name: "Murilo Miranda",
    link: "https://www.linkedin.com/in/murilo-miranda-7b0614269/",
  },
  {
    ...constantElements,
    src: constantElements.src + "gabriellymaria.jpg",
    name: "Gabrielly Maria",
    link: "https://www.linkedin.com/in/gabrielly-maria/",
  },
  {
    ...constantElements,
    src: constantElements.src + "vitoriacosta.jpg",
    name: "Vitória da Silva Costa",
    link: "https://www.linkedin.com/in/vit%C3%B3ria-costa-5b8853239/",
  },
  {
    ...constantElements,
    src: constantElements.src + "julianabuono.jpg",
    name: "Juliana Andrade Buono",
    link: "https://www.linkedin.com/in/juliana-andrade-buono-01b88236b/",
  },
  {
    ...constantElements,
    src: null,
    name: "Eduardo Lemos",
    link: "https://www.linkedin.com/in/eduardo-lemos-paschoalini/",
  },
  {
    ...constantElements,
    src: null,
    name: "Henrique Brito",
    link: "https://www.linkedin.com/in/henrique-brito-647306360/",
  },
  {
    ...constantElements,
    src: null,
    name: "Renan Machado Santos",
    link: "https://www.linkedin.com/in/renanms/",
  },
  {
    ...constantElements,
    src: null,
    name: "Nicolas Magno",
    link: "https://www.linkedin.com/in/nicolas-magno-176b31208/",
  },
  {
    ...constantElements,
    src: null,
    name: "Lucas Rodrigues da Silva",
    link: "https://cloudlabs.ufscar.br/",
  },
  {
    ...constantElements,
    src: null,
    name: "Murilo Mantovani",
    link: "https://www.linkedin.com/in/murilo-oliva-mantovani/",
  },
  {
    ...constantElements,
    src: null,
    name: "José Mateus Queiroz",
    link: "https://github.com/jmateusq",
  },
  {
    ...constantElements,
    src: null,
    name: "Nathalia Cristina Santos",
    link: "https://www.linkedin.com/in/nath%C3%A1lia-cristina-santos-a90559212/",
  },
  {
    ...constantElements,
    src: null,
    name: "Oliver Miyar Ugarte",
    link: "https://www.linkedin.com/in/olivermiyarugarte/",
  },
  {
    ...constantElements,
    src: null,
    name: "Gabriel Veríssimo",
    link: "https://www.linkedin.com/in/gabriel-ver%C3%ADssimo-828124314/",
  },
  {
    ...constantElements,
    src: null,
    name: "Leonardo Pissolati",
    link: "https://www.linkedin.com/in/leonardo-pissolati-7545b2369/",
  },
].sort(sortMembers);
