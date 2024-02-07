import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children: ReactNode;
}

export const Button = ({ onClick, type = "button", children }: ButtonProps) => {
  return (
    <button
      type={type}
      className="w-24 font-semibold text-sm bg-point text-white p-3 rounded-full hover:drop-shadow-md hover:opacity-70 transition-all float-right"
      onClick={() => {
        onClick?.();
      }}
    >
      {children}
    </button>
  );
};
