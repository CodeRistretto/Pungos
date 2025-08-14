import RulesClient from "./rules-client";

export default function Page({ searchParams }) {
  const defaultCampaign =
    typeof searchParams?.campaignId === "string" ? searchParams.campaignId : "";
  return <RulesClient defaultCampaign={defaultCampaign} />;
}