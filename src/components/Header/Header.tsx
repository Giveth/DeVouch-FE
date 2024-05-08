"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../Button";
import { useAccount } from "wagmi";
import { summarizeAddress } from "@/helpers/wallet";
import Dropdown from "../Dropdown/Dropdown";

export const Header = () => {
  const { address, isConnected, isConnecting } = useAccount();
  return (
    <div className="container mx-auto py-10 flex justify-between items-center">
      <Image src="/images/logo.svg" alt="logo" width={165} height={30} />
      {address ? (
        <Dropdown
          label={summarizeAddress(address)}
          options={[{ label: "Disconnect", cb: () => {} }]}
          stickToRight
        />
      ) : (
        <Button>Connect Wallet</Button>
      )}
    </div>
  );
};
