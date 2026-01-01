import React from "react";
import { Analytics } from '@vercel/analytics/next';
const layout = ({ children }: { children: React.ReactNode }) => {
  return <div>
    {children}
    <Analytics />
    <div className="mt-0"></div>
  </div>;
};

export default layout;
