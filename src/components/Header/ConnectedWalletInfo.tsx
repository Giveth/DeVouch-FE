import { summarizeAddress } from "@/helpers/wallet";
import { useWalletInfo } from "@web3modal/wagmi/react";
import Image from "next/image";
import React from "react";
import { useAccount } from "wagmi";

export const ConnectedWalletInfo = () => {
  const { walletInfo } = useWalletInfo();
  console.log(walletInfo?.name, walletInfo?.icon);
  const { address, isConnected, isConnecting } = useAccount();

  return address ? (
    <div className="flex gap-3">
      {walletInfo?.icon && (
        <div>
          <Image
            src={walletInfo?.icon}
            width={24}
            height={24}
            alt="Wallet Icon"
          />
        </div>
      )}
      <div>{summarizeAddress(address)}</div>
    </div>
  ) : (
    <div>Not Connected</div>
  );
};
