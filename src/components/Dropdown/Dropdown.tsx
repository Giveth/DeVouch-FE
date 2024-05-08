"use client";
import {
  useState,
  useRef,
  useEffect,
  type CSSProperties,
  type ReactNode,
  type SetStateAction,
  type Dispatch,
  type FC,
} from "react";
import { createPortal } from "react-dom";

export enum EOptionType {
  ITEM,
  SEPARATOR,
}

export interface IOption {
  type?: EOptionType;
  label?: string;
  icon?: ReactNode;
  cb?: any;
  isHidden?: boolean;
  color?: string;
}

interface DropdownProps {
  label: string;
  stickToRight?: boolean;
  options: IOption[];
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  stickToRight,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownStyle: CSSProperties =
    isOpen && containerRef.current
      ? {
          position: "absolute",
          top:
            containerRef.current.getBoundingClientRect().bottom +
            window.scrollY +
            "px",
          right: stickToRight
            ? document.documentElement.clientWidth -
              containerRef.current.getBoundingClientRect().right +
              window.scrollX +
              "px"
            : "unset",
          left: stickToRight
            ? "unset"
            : containerRef.current.getBoundingClientRect().left +
              window.scrollX +
              "px",
        }
      : {};

  return (
    <div
      className="relative select-none cursor-pointer"
      ref={containerRef}
      onClick={toggleDropdown}
    >
      <div className="flex justify-between w-full border py-4 px-6 border-black bg-white mb-2">
        <div>{label}</div>
      </div>
      {isOpen &&
        createPortal(
          <div
            style={dropdownStyle}
            ref={dropdownRef}
            className=" border py-4 px-6 border-black bg-white"
          >
            {options.map((option, idx) =>
              option.isHidden ? null : (
                <Option key={idx} option={option} setIsOpen={setIsOpen} />
              )
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

interface OptionProps {
  option: IOption;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  color?: string;
}

const Option: FC<OptionProps> = ({ option, setIsOpen }) => {
  return option.type === EOptionType.SEPARATOR ? (
    <hr className="border-none border-t border-gray-300 w-full my-2" />
  ) : (
    <div
      className="flex p-2 px-4 item-center gap-2 cursor-pointer hover:bg-gray-100"
      onClick={() => {
        option.cb && option.cb();
        setIsOpen(false);
      }}
    >
      {option.icon && option.icon}
      {option.label}
    </div>
  );
};

export default Dropdown;
