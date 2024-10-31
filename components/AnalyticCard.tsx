import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface AnalyticCardProps {
  title: string;
  value: number | undefined;
}
const AnalyticCard = ({ value, title }: AnalyticCardProps) => {
  return (
    <Card className="shadow-sm border-2 mb-5 border-gray-100 w-full bg-white flex flex-row md:flex-col">
      <CardHeader>
        <span className="flex items-center gap-3">
          <CardDescription className="flex items-center gap-x-3 font-medium overflow-hidden">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
        </span>
        <CardTitle className="text-xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default AnalyticCard;
