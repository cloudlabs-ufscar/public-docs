import SectionTitle from "@site/src/components/SectionTitle/SectionTitle";
import React, { FunctionComponent } from "react";
import styles from "./LuizaLabsCollaboratorsSection.module.css";

const LuizaLabsCollaboratorsSection: FunctionComponent = () => {
  return (
    <div className="container">
      <SectionTitle>Agradecimento</SectionTitle>

      <div className={styles.card}>
        <p className={styles.text}>
        Agradecemos a cada pessoa da Magalu Cloud
        que contribuiu e continua contribuindo na realização
        dos nossos projetos.
        </p>
      </div>
    </div>
  );
};

export default LuizaLabsCollaboratorsSection;