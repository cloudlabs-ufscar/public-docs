import Link from "@docusaurus/Link";

import SectionTitle from "@site/src/components/SectionTitle/SectionTitle";

import { FunctionComponent } from "react";

import styles from "./SupportSection.module.css";

const SupportList = [
  {
    src: "img/logoufscar.png",
    link: "https://www.ufscar.br/",
  },
  {
    src: "img/logoluizalabs.png",
    link: "https://www.linkedin.com/company/magalucloud/",
  },
];

const SupportSection: FunctionComponent = () => {
  return (
    <div className="container">
      <section className={styles.block}>
        <SectionTitle>Apoiadores</SectionTitle>

        <div className={styles.description}>
          <p>
            Nosso trabalho é possível graças à colaboração de instituições que
            apoiam a pesquisa e a inovação. Temos a honra de contar com a Magalu
            Cloud como colaboradora técnica, uma parceria que enriquece nosso
            ambiente de pesquisa com insights práticos e experiência do setor.
            Juntos, exploramos novas fronteiras, aplicando nossa pesquisa em um
            contexto real e contribuindo para a evolução contínua de tecnologias
            de data centers.
          </p>
        </div>

        <div className={styles.imgBox}>
          {SupportList.map(({ src, link }, index) => (
            <Link href={link} key={index}>
              <img className={styles.image} src={src} />
            </Link>
          ))}
        </div>

        <div className={styles.partnership}>
          <p>Interessado em colaborar com o CloudLabs?</p>

          <Link
            href="https://cloudlabs.ufscar.br/"
            className={styles.partnershipLink}
          >
            Conheça nossas formas de parceria
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SupportSection;
