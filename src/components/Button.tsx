import React from "react";

export const Button = () => {
  return (
    <div className="group relative m-2  text-white">
      <div
        id="shadow"
        className="absolute w-full h-full bg-black z-0  bottom-0 animate-move-bounce-leave transform group-hover:animate-move-bounce-enter"
      />
      <button
        type="button"
        className="bg-c-blue-200 z-1 relative py-2 px-4 group-hover:animate-color-bounce-enter"
      >
        Click Me!
      </button>
    </div>
  );
};
