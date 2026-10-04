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
  };

  static getGroupsData = () => {
    return Object.values(this.groupData);
  };

  static getGroupData = ({ names }: GetGroupDataInput) => {
    return names?.map((name) => this.groupData[name]);
  };
}
