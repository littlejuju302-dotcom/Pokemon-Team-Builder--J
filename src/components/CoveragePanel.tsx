import { useMemo } from 'react';
import { TypeBadge } from './TypeBadge';
import { analyzeTeamCoverage } from '../utils/coverage';
import { ALL_TYPES, getDefensiveEffectiveness } from '../data/typeChart';
import type { TeamMember } from '../types/pokemon';

interface Props {
  members: (TeamMember | null)[];
}

export function CoveragePanel({ members }: Props) {
  const active = members.filter(Boolean) as TeamMember[];
  const coverage = useMemo(() => analyzeTeamCoverage(members), [members]);

  if (active.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center text-slate-500 text-sm">
        Add Pokémon to your team to see coverage analysis.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Defensive type chart */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Defensive Type Coverage</h3>
        <p className="text-xs text-slate-500 mb-3">How many team members are weak to each type</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ALL_TYPES.map(attackType => {
            const count = coverage.defensiveWeaknesses.find(w => w.type === attackType)?.count ?? 0;
            const resCount = coverage.defensiveResistances.find(r => r.type === attackType)?.count ?? 0;
            const severity = count >= 3 ? 'border-red-500' : count >= 2 ? 'border-orange-500' : count >= 1 ? 'border-yellow-600' : 'border-slate-700';
            return (
              <div key={attackType} className={`border rounded-lg p-2 flex flex-col items-center gap-1 ${severity}`}>
                <TypeBadge type={attackType} small />
                <div className="text-xs flex gap-2">
                  {count > 0 && <span className="text-red-400 font-bold">×{count}</span>}
                  {resCount > 0 && <span className="text-green-400 font-bold">+{resCount}</span>}
                  {count === 0 && resCount === 0 && <span className="text-slate-600">—</span>}
                </div>
              </div>
            );
          })}
        </div>
        {coverage.defensiveWeaknesses.filter(w => w.count >= 2).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1 items-center">
            <span className="text-xs text-red-400 font-semibold">Danger zones:</span>
            {coverage.defensiveWeaknesses.filter(w => w.count >= 2).map(w => (
              <TypeBadge key={w.type} type={w.type} small />
            ))}
          </div>
        )}
      </div>

      {/* Offensive coverage */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-1">Offensive Coverage</h3>
        <p className="text-xs text-slate-500 mb-3">Types your team hits super effectively (via STAB or moves)</p>
        <div className="flex flex-wrap gap-1">
          {coverage.offensiveCoverage.map(t => <TypeBadge key={t} type={t} small />)}
        </div>
        {coverage.offensiveGaps.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-amber-400 font-semibold mb-1">Coverage gaps:</p>
            <div className="flex flex-wrap gap-1">
              {coverage.offensiveGaps.map(t => (
                <span key={t} className="inline-block text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide text-slate-400 border border-slate-600">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Per-Pokemon defensive chart */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Per-Pokémon Weaknesses</h3>
        <div className="flex flex-col gap-3">
          {active.map(member => {
            const eff = getDefensiveEffectiveness(member.pokemon.types);
            const weaknesses = ALL_TYPES.filter(t => eff[t] > 1);
            const immunities = ALL_TYPES.filter(t => eff[t] === 0);
            return (
              <div key={member.pokemon.name} className="text-xs">
                <div className="font-semibold text-slate-300 mb-1">{member.pokemon.name}</div>
                <div className="flex flex-wrap gap-1">
                  {weaknesses.map(t => (
                    <span key={t} title={`×${eff[t]}`}>
                      <TypeBadge type={t} small />
                      {eff[t] >= 4 && <span className="ml-0.5 text-red-400 font-bold">×4</span>}
                    </span>
                  ))}
                  {immunities.map(t => (
                    <span key={t} className="text-slate-500 text-[10px] px-1.5 py-0.5 rounded border border-slate-700">0× {t}</span>
                  ))}
                  {weaknesses.length === 0 && immunities.length === 0 && (
                    <span className="text-slate-500">No weaknesses</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
