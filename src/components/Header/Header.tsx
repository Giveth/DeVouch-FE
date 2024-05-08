"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../Button";
import { useAccount } from "wagmi";
import { summarizeAddress } from "@/helpers/wallet";
import Dropdown from "../Dropdown/Dropdown";
import { ConnectedWalletInfo } from "./ConnectedWalletInfo";

export const Header = () => {
  const { address } = useAccount();
  return (
    <div className="container mx-auto py-10 flex justify-between items-center">
      <Image src="/images/logo.svg" alt="logo" width={165} height={30} />
      {address ? (
        <Dropdown
          label={<ConnectedWalletInfo />}
          options={[
            <div className="text-gray-600 py-2 px-2 cursor-pointer transition-colors hover:bg-gray-100">
              My Attestations
            </div>,
            <div className="text-gray-600 py-2 px-2 cursor-pointer transition-colors hover:bg-gray-100">
              Support
            </div>,
            <hr className="my-2" />,
            <div className="text-gray-600 py-2 px-2 cursor-pointer transition-colors hover:bg-gray-100 flex gap-4 justify-between min-w-52">
              <div>Disconnect</div>
              <Image
                src="/images/icons/power-sharp.svg"
                alt="disconnect"
                width={20}
                height={20}
              />
            </div>,
          ]}
          stickToRight
        />
      ) : (
        <Button>Connect Wallet</Button>
      )}
    </div>
  );
};
