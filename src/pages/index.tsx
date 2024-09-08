import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import LuizaLabsCollaboratorsSection from "./home/LuizaLabsCollaboratorsSection/LuizaLabsCollaboratorsSection";
import MembersSection from "./home/MembersSection/MembersSection";
import OldMembersSectionSection from "./home/OldMembersSection/OldMembersSection";
import PresentationSection from "./home/PresentationSection/PresentationSection";
import ResearchGroupsViewer from "./home/ResearchGroupsViewer/ResearchGroupsViewer";
import SupportSection from "./home/SupportSection/SupportSection";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className={clsx("container")}>
        <img src="img/logo.png" className={styles.icon} />
        <p className={clsx("hero__subtitle", styles.text)}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Acesse nossa documentação
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout description="Grupo de pesquisa do Departamento de Computação da UFSCar, dedicado à pesquisa e ao desenvolvimento em tecnologias para data centers, com foco em soluções em virtualização. Conheça nossos projetos e avanços tecnológicos para eficiência e segurança em ambientes de data centers.">
      <HomepageHeader />
      <main className={styles.container}>
        <PresentationSection />
        <SupportSection />
        <ResearchGroupsViewer />
        <LuizaLabsCollaboratorsSection />
        <MembersSection />
        <OldMembersSectionSection />
      </main>
    </Layout>
  );
}
