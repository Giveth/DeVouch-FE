import { Header } from "@/components/Header/Header";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col gap-50 relative">
      <Image
        className="absolute top-28 -z-10"
        src="/images/arcs/1.svg"
        width={116}
        height={369}
        alt="arc-1"
      />
      <Header />
      <div className="container mx-auto ">
        <div className="px-20 py-10 flex flex-col gap-6">
          <h1 className="text-8xl	font-bold leading-normal">
            On-Chain Vouching via Attestations
          </h1>
          <p className="text-xl leading-relaxed">
            Vouch for the projects that you believe in and build an on-chain
            record of reliability. DeVouch refines funding decisions by letting
            communities lend their credibility using the power of Ethereum
            Attestations.
          </p>
          <div>
            <Link
              href={"/"}
              className="inline-block font-bold bg-gradient-to-t from-c-blue-200 to-c-blue-100 text-transparent bg-clip-text leading-tight"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
