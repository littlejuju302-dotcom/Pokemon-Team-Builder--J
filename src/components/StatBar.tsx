interface Props {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

const STAT_COLORS: Record<string, string> = {
  HP:      '#ff5959',
  ATK:     '#f5ac78',
  DEF:     '#fae078',
  SPA:     '#9db7f5',
  SPD:     '#a7db8d',
  SPE:     '#fa92b2',
};

export function StatBar({ label, value, max = 255 }: Props) {
  const pct = Math.min(100, (value / max) * 100);
  const color = STAT_COLORS[label] ?? '#7c3aed';
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-8 text-xs font-bold text-slate-400">{label}</span>
      <span className="w-8 text-right font-mono text-slate-200 text-xs">{value}</span>
      <div className="flex-1 h-2 rounded-full bg-slate-700">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
