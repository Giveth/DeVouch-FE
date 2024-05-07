import Image from "next/image";
import React from "react";

export const Header = () => {
  return (
    <div className="container mx-auto py-10 flex">
      <Image src="/images/logo.svg" alt="logo" width={165} height={30} />
    </div>
  );
};
