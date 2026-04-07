import React from "react";
import {
  Landmark,
  AlertTriangle,
  LayoutGrid,
  Wrench,
  Target,
  BookOpen,
  Scale,
  ClipboardList,
  CheckCircle,
  Search,
  Layers,
  Globe,
  ShieldCheck,
  Lock,
  Users,
  BarChart2,
  Settings2,
  Briefcase,
  FileText,
  Activity,
  Network,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  // module icons
  landmark: Landmark,
  "alert-triangle": AlertTriangle,
  "layout-grid": LayoutGrid,
  wrench: Wrench,
  target: Target,
  // topic icons
  "book-open": BookOpen,
  scale: Scale,
  "clipboard-list": ClipboardList,
  "check-circle": CheckCircle,
  search: Search,
  layers: Layers,
  globe: Globe,
  "shield-check": ShieldCheck,
  lock: Lock,
  users: Users,
  "bar-chart": BarChart2,
  settings: Settings2,
  briefcase: Briefcase,
  "file-text": FileText,
  activity: Activity,
  network: Network,
};

interface GRCIconProps {
  name: string;
  className?: string;
}

export function GRCIcon({ name, className = "w-5 h-5" }: GRCIconProps) {
  const Icon = iconMap[name] ?? BookOpen;
  return <Icon className={className} />;
}
