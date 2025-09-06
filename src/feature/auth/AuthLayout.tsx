import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode; // Form component passed as children
  sideComponent?: React.ReactNode;
  fullWidthSide?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  sideComponent,
  fullWidthSide = false,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {sideComponent ? (
        <div
          className={`w-full max-w-6xl mx-auto ${fullWidthSide ? "" : "p-6"}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:order-2 hidden md:block">{sideComponent}</div>
            <div className="md:order-1 flex items-center justify-center">
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full px-0 max-w-md">{children}</div>
      )}
    </div>
  );
};

export default AuthLayout;
