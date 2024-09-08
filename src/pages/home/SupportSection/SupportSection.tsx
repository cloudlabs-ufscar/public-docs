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
    link: "https://www.linkedin.com/company/luizalabs/",
  },
];

const SupportSection: FunctionComponent = () => {
  return (
    <div className={"container"}>
      <SectionTitle>Apoiadores</SectionTitle>
      <div className={styles.imgBox}>
        {SupportList?.map(({ src, link }, index) => (
          <Link href={link} key={index}>
            <img className={styles.image} src={src} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SupportSection;
