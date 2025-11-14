import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`rounded-xl shadow-lg bg-white/80 p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
