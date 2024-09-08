import Link from "@docusaurus/Link";
import { IMember } from "@site/src/data/interfaces/IMember";
import { FunctionComponent } from "react";
import styles from "./MemberViewer.module.css";

type MemberViewerProps = IMember;

const MemberViewer: FunctionComponent<MemberViewerProps> = ({
  name,
  src,
  link,
}) => {
  return (
    <Link href={link} target="_blank" className={styles.cardBox}>
      <img
        src={src ?? "img/blankprofile.jpg"}
        alt={`Imagem do membro ${name}`}
        className={styles.memberImage}
      />
      <span className={styles.memberName}>{name}</span>
    </Link>
  );
};

export default MemberViewer;
