import Image from "next/image";
import { type FC } from "react";

interface ChainIconProps {
  chainId: number;
  size: number;
}

const mapChainIdToSymbol: {
  [key: number]: string;
} = {
  1: "eth",
  11155111: "eth",
};

export const ChainIcon: FC<ChainIconProps> = ({ chainId, size }) => {
  const symbol = mapChainIdToSymbol[chainId];
  return symbol ? (
    <Image
      src={`/images/chains/${mapChainIdToSymbol[chainId]}/${size}.svg`}
      width={size}
      height={size}
      alt="chain icon"
    />
  ) : null;
};
