import { Children, type FC } from "react";

interface ButtonProps {
  children: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({ children }) => {
  return (
    <div className="group relative m-4  text-white h-10">
      <div
        id="shadow"
        className="absolute w-full h-full bg-black z-0  bottom-0 animate-move-bounce-leave transform group-hover:animate-move-bounce-enter"
      />
      <button
        type="button"
        className="bg-c-blue-200 z-1 relative py-2 px-4 group-hover:animate-color-bounce-enter"
      >
        {children}
      </button>
    </div>
  );
};
