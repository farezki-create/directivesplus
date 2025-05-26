
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ExtractionMethodCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action: () => void;
  color: string;
  activeMethod: string;
}

const ExtractionMethodCard: React.FC<ExtractionMethodCardProps> = ({
  id,
  title,
  description,
  icon: Icon,
  action,
  color,
  activeMethod
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${color} ${activeMethod === id ? 'ring-2 ring-blue-500' : ''}`}
      onClick={action}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-sm">{title}</h4>
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtractionMethodCard;
