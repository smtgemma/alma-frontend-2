import React from "react";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`${className} lg:px-[300px]`}>{children}</div>;
};

export default Container;
