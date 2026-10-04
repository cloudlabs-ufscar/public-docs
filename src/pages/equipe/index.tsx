import Layout from "@theme/Layout";
import MembersSection from "./MembersSection/MembersSection";
import OldMembersSection from "./OldMembersSection/OldMembersSection";
import LuizaLabsCollaboratorsSection from "./LuizaLabsCollaboratorsSection/LuizaLabsCollaboratorsSection";

export default function Equipe() {
  return (
    <Layout title="Equipe" description="Conheça a equipe do projeto">
      <MembersSection />
      <LuizaLabsCollaboratorsSection />
      <OldMembersSection />
    </Layout>
  );
}
