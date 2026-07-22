import type { Metadata } from "next";
import Link from "next/link";
import { GenesisLab } from "@/components/genesis/GenesisLab";

export const metadata: Metadata = {
  title: "Genesis Lab — Earth-like world habitation science",
  description:
    "Step-by-step educational biology for inhabiting an Earth-like world: climate, flora, fauna, DNA, food webs. No wrong path — final essay with sim evidence.",
};

export default function GenesisPage() {
  return (
    <div className="page-shell">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link href="/" className="link-back">
          ← Home
        </Link>
        <Link href="/year/7/computerscience" className="link-back">
          Computer Science
        </Link>
        <Link href="/year/7/science" className="link-back">
          Science
        </Link>
      </div>
      <GenesisLab />
    </div>
  );
}
