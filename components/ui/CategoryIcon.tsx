import {
  Brain,
  Wand2,
  Theater,
  Ghost,
  Bone,
  Flame,
  Skull,
  Sparkles,
  Bandage,
  type LucideProps,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  zombie:   Brain,
  witch:    Wand2,
  clown:    Theater,
  ghost:    Ghost,
  skeleton: Bone,
  monster:  Flame,
  reaper:   Skull,
  wizard:   Sparkles,
  mummy:    Bandage,
};

interface CategoryIconProps {
  id: string;
  size?: number;
  className?: string;
}

export default function CategoryIcon({ id, size = 32, className = "" }: CategoryIconProps) {
  const Icon = ICONS[id] ?? Skull;
  return <Icon size={size} strokeWidth={1.25} className={className} />;
}
