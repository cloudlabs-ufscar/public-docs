import { FunctionComponent } from "react";

import styles from "./PresentationSection.module.css";

import SectionTitle from "@site/src/components/SectionTitle/SectionTitle";
import PresentationSectionItem from "./PresentationSectionItem/PresentationSectionItem";

const PresentationSection: FunctionComponent = () => {
  return (
    <div className="container">
      <section className={styles.block}>
        <SectionTitle>Sobre o CloudLabs</SectionTitle>

        <div className={styles.description}>
          <span>
            O CloudLabs é um grupo de pesquisa do Departamento de Computação da
            Universidade Federal de São Carlos (UFSCar), criado em parceria com
            a Magalu Cloud para investigar tecnologias aplicadas a data centers
            e à computação em nuvem. O projeto aproxima a pesquisa acadêmica de
            experiências e desafios do setor, criando um ambiente para
            experimentação e desenvolvimento de soluções em cenários reais.
          </span>
        </div>
      </section>

      <section className={styles.block}>
        <SectionTitle>Nossos objetivos</SectionTitle>

        <div className={styles.objectives}>
          <div className="row">
            <PresentationSectionItem
              number="01"
              title="Investigar"
              description="Estudar tecnologias e ferramentas voltadas à computação em nuvem e data centers."
            />

            <PresentationSectionItem
              number="02"
              title="Experimentar"
              description="Construir ambientes e realizar experimentos utilizando virtualização e outras tecnologias."
            />

            <PresentationSectionItem
              number="03"
              title="Avaliar"
              description="Analisar desempenho, escalabilidade, confiabilidade e eficiência das soluções estudadas."
            />

            <PresentationSectionItem
              number="04"
              title="Inovar"
              description="Explorar novas abordagens e contribuir para a evolução das tecnologias para data centers."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PresentationSection;
