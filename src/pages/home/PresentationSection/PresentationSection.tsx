import { FunctionComponent, ReactNode } from "react";
import styles from "./PresentationSection.module.css";
import SectionTitle from "@site/src/components/SectionTitle/SectionTitle";

const PresentationSection: FunctionComponent = () => {
  return (
    <div className="container">
      <SectionTitle>A nossa história</SectionTitle>
      <ul className={styles.description}>
        <span>
          CloudLabs é um grupo de pesquisa do Departamento de
          Computação da Universidade Federal de São Carlos (UFSCar), criado e financiado a partir 
          de uma parceiria com o LuizaLabs, com o objetivo de investigar o cenário de tecnologias para data centers.
          Nossa meta é analisar, estudar e experimentar o uso de ferramentas associadas a cloud
          focalizando a aplicação de virtualização em cinco áreas essenciais:
          storage, SRE (Site Reliability Engineering), network, infraestrutura e
          load balancing.
        </span>
        <span>
          CloudLabs tem a honra de contar com o LuizaLabs como colaborador técnico,
          uma parceria que enriquece nosso ambiente de pesquisa com insights
          práticos e experiência do setor. Juntos, exploramos novas fronteiras,
          aplicando nossa pesquisa em um contexto real e contribuindo para a
          evolução contínua de tecnologias de data centers.
        </span>
        <span>
          Estamos abertos a novos apoios e parceirias.
        </span>
      </ul>
    </div>
  );
};

export default PresentationSection;
