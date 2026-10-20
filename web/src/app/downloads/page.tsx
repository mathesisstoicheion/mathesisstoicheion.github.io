import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import ScrollCase from "@/components/offline/ScrollCase";
import { areaTitle } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: areaTitle("downloads"), description: PAGE_DESCRIPTIONS.downloads };

export default function DownloadsPage() {
  return (
    <Page>
      <AreaHeader id="downloads" />
      <ScrollCase />
    </Page>
  );
}
