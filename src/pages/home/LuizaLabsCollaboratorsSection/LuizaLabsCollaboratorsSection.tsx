import SectionTitle from "@site/src/components/SectionTitle/SectionTitle";
import React, { FunctionComponent } from "react";
import styles from "./LuizaLabsCollaboratorsSection.module.css";

interface ILuizaLabsCollaboratorsData {
  label: string;
  names: string[];
}

const LuizaLabsCollaboratorsData: ILuizaLabsCollaboratorsData[] = [
  {
    label: "Diretor",
    names: ["Christian (Kiko) Robottom Reis"],
  },
  {
    label: "Líder Técnico",
    names: ["Leandro Poloni"],
  },
  {
    label: "Tribe Leader",
    names: ["James Troup"],
  },
  {
    label: "Gestão Financeira",
    names: ["André Fior", "Yuli"],
  },
  {
    label: "Gestão de Programas",
    names: ["Rogério Carlesso"],
  },
  {
    label: "Direcionamento Técnico",
    names: [
      "Alcides M. Silva",
      "Celso Providelo",
      "Leandro Poloni",
      "Paulo Rodriguez",
      "Diego Osse",
      "Juliano Piassa",
      "Sérgio Cipriano",
    ],
  },
];

const LuizaLabsCollaboratorsSection: FunctionComponent = () => {
  return (
    <div className="container">
      <SectionTitle>LuizaLabs</SectionTitle>
      {LuizaLabsCollaboratorsData.map(({ label, names }, index) => (
        <div className={styles.group} key={index}>
          <div className={styles.label}>{label}:</div>
          <div className={styles.name}>{names.join(", ")}</div>
        </div>
      ))}
    </div>
  );
};

export default LuizaLabsCollaboratorsSection;
