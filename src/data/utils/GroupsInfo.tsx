import GroupsEnum from "../enums/GroupsEnum";

interface GetGroupDataInput {
  names: GroupsEnum[];
}

export interface GroupData {
  name: GroupsEnum;
  description: string;
  formattedName: string;
  icon: React.ComponentType<React.ComponentProps<"svg">>;
}

export default class GroupsInfo {
  private static groupData: Record<GroupsEnum, GroupData> = {
    STORAGE: {
      name: GroupsEnum.STORAGE,
      formattedName: "Storage",
      description:
        "Investigamos inovações e a aplicação de resultados de pesquisa no armazenamento de dados, buscando soluções para confiabilidade, escalabilidade e desempenho em ambientes de data center.",
      icon: require("@site/static/img/storage.svg").default,
    },
    NETWORK: {
      name: GroupsEnum.NETWORK,
      formattedName: "Network",
      description:
        "Exploramos fronteiras na área de redes, procurando aplicar tecnologias e estratégias que aprimoram a conectividade, a segurança e a eficiência das redes em ambientes virtualizados.",
      icon: require("@site/static/img/network.svg").default,
    },
    INFRASTRUCTURE: {
      name: GroupsEnum.INFRASTRUCTURE,
      formattedName: "Infrastructure",
      description:
        "Nosso compromisso com a pesquisa em infraestrutura envolve a criação de ambientes eficientes, escaláveis e flexíveis, de forma automatizada, fundamentais para a sustentação de operações críticas em data centers modernos.",
      icon: require("@site/static/img/infra.svg").default,
    },
    LOAD_BALANCING: {
      name: GroupsEnum.LOAD_BALANCING,
      formattedName: "Load Balancing",
      description:
        "Buscamos explorar e aplicar técnicas de balanceamento de carga para otimizar a distribuição de tráfego e recursos, visando à utilização eficiente dos recursos disponíveis.",
      icon: require("@site/static/img/load_balacing.svg").default,
    },
    SRE: {
      name: GroupsEnum.SRE,
      formattedName: "Site Reliability Engineering (SRE)",
      description:
        "Este grupo investiga a vanguarda das práticas de SRE, focando na criação de sistemas robustos, confiáveis e eficientes, que promovam a disponibilidade contínua dos serviços e aplicativos hospedados em nossos data centers.",
      icon: require("@site/static/img/sre.svg").default,
    },
  };

  static getGroupsData = () => {
    return Object.values(this.groupData);
  };

  static getGroupData = ({ names }: GetGroupDataInput) => {
    return names?.map((name) => this.groupData[name]);
  };
}
