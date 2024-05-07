import Image from "next/image";
import React from "react";
import { Button } from "./Button";

export const Header = () => {
  return (
    <div className="container mx-auto py-10 flex justify-between items-center">
      <Image src="/images/logo.svg" alt="logo" width={165} height={30} />
      <Button />
    </div>
  );
};
