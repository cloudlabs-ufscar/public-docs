import { FunctionComponent } from "react";
import styles from "./PresentationSection.module.css";
import SectionTitle from "@site/src/components/SectionTitle/SectionTitle";

const PresentationSection: FunctionComponent = () => {
  return (
    <div className="container">
      <section className={styles.block}>
        <SectionTitle>Conheça a Equipe</SectionTitle>

        <div className={styles.description}>
          <span>
            O CloudLabs é construído por pessoas com diferentes conhecimentos,
            experiências e perspectivas, que compartilham o interesse em
            explorar novas possibilidades nas tecnologias para data centers e
            computação em nuvem. Nesta página, você pode conhecer quem faz parte
            do CloudLabs atualmente e também aqueles que contribuíram para a
            história do grupo. Cada integrante deixa sua marca em nossa
            trajetória por meio de pesquisas, projetos, experimentos e
            colaborações.
          </span>
          <span className={styles.highlight}>
            Conheça as pessoas por trás das pesquisas que movem o CloudLabs!
          </span>
        </div>
      </section>
    </div>
  );
};

export default PresentationSection;
