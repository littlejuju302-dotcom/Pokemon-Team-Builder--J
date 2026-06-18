import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Shield, Swords, Target, TrendingUp, Users } from 'lucide-react';
import { PokemonBrowser } from './components/PokemonBrowser';
import { TeamSlot } from './components/TeamSlot';
import { TeamSaver } from './components/TeamSaver';
import { CoveragePanel } from './components/CoveragePanel';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { MatchupPicker } from './components/MatchupPicker';
import { useTeam } from './hooks/useTeam';

const queryClient = new QueryClient();

type Tab = 'browse' | 'coverage' | 'recommendations' | 'matchup';

function TeamBuilder() {
  const [tab, setTab] = useState<Tab>('browse');
  const { members, addPokemon, removePokemon, setMoves, setNature, setItem, setMegaEvolved, setSelectedAbility, setSpAllocation, loadTeam, isFull, count, hasPokemon } = useTeam();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'browse', label: 'Trending', icon: <TrendingUp size={14} /> },
    { id: 'coverage', label: 'Coverage', icon: <Shield size={14} /> },
    { id: 'recommendations', label: 'Suggestions', icon: <Swords size={14} /> },
    { id: 'matchup', label: 'Matchup', icon: <Target size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 leading-none">Champions Team Builder</h1>
              <p className="text-xs text-slate-500 mt-0.5">Pokémon Champions • Regulation M-B</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {members.map((m, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold overflow-hidden ${
                    m ? 'border-violet-500' : 'border-slate-700'
                  }`}
                >
                  {m ? (
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${m.pokemon.dexNumber}.png`}
                      alt={m.pokemon.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-slate-700">{i + 1}</span>
                  )}
                </div>
              ))}
            </div>
            <span className="text-xs text-slate-500">{count}/6</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left: Team */}
        <div className="lg:w-80 xl:w-96 flex-shrink-0">
          <div className="sticky top-20 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-1 lg:pb-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Your Team</h2>
            <div className="flex flex-col gap-2">
              {members.map((member, i) => (
                <TeamSlot
                  key={i}
                  member={member}
                  slotIndex={i}
                  onRemove={removePokemon}
                  onSetMoves={setMoves}
                  onSetNature={setNature}
                  onSetItem={setItem}
                  onSetMegaEvolved={setMegaEvolved}
                  onSetSelectedAbility={setSelectedAbility}
                  onSetSpAllocation={setSpAllocation}
                />
              ))}
            </div>
            {isFull && (
              <div className="mt-3 bg-violet-900/30 border border-violet-700/50 rounded-lg p-2.5 text-xs text-violet-300 text-center">
                Team full! Remove a Pokémon to add another.
              </div>
            )}
            <TeamSaver members={members} onLoad={loadTeam} />
          </div>
        </div>

        {/* Right: tabs */}
        <div className="flex-1 min-w-0">
          {/* Tab bar */}
          <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl mb-4 overflow-x-auto no-scrollbar">
            {tabs.map(t => (
              <button
                key={t.id}
                title={t.label}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex-shrink-0 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-violet-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {tab === 'browse' && (
            <PokemonBrowser
              onAddPokemon={addPokemon}
              hasPokemon={hasPokemon}
              teamFull={isFull}
            />
          )}
          {tab === 'coverage' && (
            <CoveragePanel members={members} />
          )}
          {tab === 'recommendations' && (
            <RecommendationsPanel
              members={members}
              onAdd={addPokemon}
              hasPokemon={hasPokemon}
              teamFull={isFull}
            />
          )}
          {tab === 'matchup' && (
            <MatchupPicker members={members} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TeamBuilder />
    </QueryClientProvider>
  );
}
