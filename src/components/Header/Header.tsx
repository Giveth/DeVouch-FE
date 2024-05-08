"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../Button";
import { useAccount } from "wagmi";

export const Header = () => {
  const { address, isConnected, isConnecting } = useAccount();
  return (
    <div className="container mx-auto py-10 flex justify-between items-center">
      <Image src="/images/logo.svg" alt="logo" width={165} height={30} />
      {address ? <Button>{address}</Button> : <Button>Connect Wallet</Button>}
    </div>
  );
};
