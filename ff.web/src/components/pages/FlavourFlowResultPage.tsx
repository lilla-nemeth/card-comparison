import Page from "../templates/Page";
import { useLocation } from "react-router-dom";

export default function FlavourFlowResultPage() {
  const location = useLocation();
  const { meals } = location.state || {};

  console.log(meals);
  return <Page>FlavourFlowResultPage</Page>;
}
