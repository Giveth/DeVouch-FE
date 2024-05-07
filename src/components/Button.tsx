import React from "react";

export const Button = () => {
  return (
    <div className="group relative m-2">
      <div
        id="shadow"
        className="absolute w-full h-full bg-black z-0  bottom-0 animate-move-bounce-leave transform group-hover:animate-move-bounce-enter"
      />
      <button
        type="button"
        className="bg-red-500 text-white z-1 relative py-2 px-4 "
      >
        Click Me!
      </button>
    </div>
  );
};
