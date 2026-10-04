import React, { FunctionComponent } from "react";
import styles from "./ResearchGroupsViewer.module.css";
import ResearchItem from "./ResearchItem/ResearchItem";
import SectionTitle from "@site/src/components/SectionTitle/SectionTitle";
import clsx from "clsx";
import GroupsInfo from "@site/src/data/utils/GroupsInfo";
import Link from "@docusaurus/Link";

const ResearchGroupsViewer: FunctionComponent = () => {
  const groupData = GroupsInfo.getGroupsData();

  return (
    <div className={clsx("container", styles.container)}>
      <section className={styles.block}>
        <SectionTitle>Frentes de Pesquisa</SectionTitle>

        <div className={styles.description}>
          <span>
            Nossa pesquisa busca estudar, experimentar e avaliar soluções
            baseadas em virtualização, explorando três frentes:
          </span>

          <div className={styles.researchCards}>
            <div className="row">
              {groupData?.map(
                ({ description, formattedName, icon, name }, index) => (
                  <ResearchItem
                    key={index}
                    description={description}
                    formattedName={formattedName}
                    icon={icon}
                    name={name}
                  />
                ),
              )}
            </div>

            <div className={styles.buttons}>
              <Link
                className={`button button--secondary button--lg ${styles.documentationButton}`}
                to="/docs/intro"
              >
                Acesse nossa documentação
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResearchGroupsViewer;
