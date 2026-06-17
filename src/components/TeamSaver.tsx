import { useState, useRef, useEffect } from 'react';
import { BookmarkPlus, Trash2, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useSavedTeams } from '../hooks/useSavedTeams';
import type { TeamMember } from '../types/pokemon';

interface Props {
  members: (TeamMember | null)[];
  onLoad: (members: (TeamMember | null)[]) => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function MiniSprites({ members }: { members: (TeamMember | null)[] }) {
  return (
    <div className="flex gap-1 mt-1.5">
      {members.map((m, i) => (
        <div key={i} className="w-7 h-7 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center border border-slate-600 flex-shrink-0">
          {m ? (
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${m.pokemon.dexNumber}.png`}
              alt={m.pokemon.name}
              className="w-full h-full object-contain"
              title={m.pokemon.name}
            />
          ) : (
            <span className="text-[8px] text-slate-600">{i + 1}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function TeamSaver({ members, onLoad }: Props) {
  const { savedTeams, saveTeam, deleteTeam } = useSavedTeams();
  const [saving, setSaving] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [expanded, setExpanded] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const activePokemon = members.filter(Boolean).length;

  useEffect(() => {
    if (saving) inputRef.current?.focus();
  }, [saving]);

  function handleSave() {
    if (activePokemon === 0) return;
    saveTeam(teamName, members);
    setTeamName('');
    setSaving(false);
  }

  return (
    <div className="mt-3 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-800 hover:bg-slate-750 transition-colors"
      >
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
          Saved Teams {savedTeams.length > 0 && <span className="text-slate-500 font-normal normal-case">({savedTeams.length})</span>}
        </span>
        {expanded ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
      </button>

      {expanded && (
        <div className="bg-slate-800/60 flex flex-col gap-0.5 p-2">
          {/* Save button / inline form */}
          {saving ? (
            <div className="flex gap-1.5 p-1">
              <input
                ref={inputRef}
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setSaving(false); }}
                placeholder="Team name…"
                maxLength={32}
                className="flex-1 bg-slate-700 border border-violet-600 text-slate-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
              />
              <button
                onClick={handleSave}
                disabled={activePokemon === 0}
                className="text-xs px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold disabled:opacity-40"
              >
                Save
              </button>
              <button
                onClick={() => setSaving(false)}
                className="text-xs px-2 py-1 rounded-lg bg-slate-700 text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSaving(true)}
              disabled={activePokemon === 0}
              className="flex items-center gap-1.5 w-full text-xs px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <BookmarkPlus size={13} />
              Save current team
            </button>
          )}

          {/* Saved team list */}
          {savedTeams.length === 0 ? (
            <p className="text-[11px] text-slate-600 text-center py-3">No saved teams yet.</p>
          ) : (
            <div className="flex flex-col gap-1 mt-1">
              {savedTeams.map(team => (
                <div key={team.id} className="bg-slate-800 border border-slate-700 rounded-lg p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{team.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {formatDate(team.savedAt)} · {team.members.filter(Boolean).length} Pokémon
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => onLoad(team.members)}
                        title="Load this team"
                        className="text-[11px] px-2 py-1 rounded-lg bg-violet-700/60 hover:bg-violet-600 text-violet-300 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Download size={10} />
                        Load
                      </button>
                      <button
                        onClick={() => deleteTeam(team.id)}
                        title="Delete"
                        className="p-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-slate-700 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <MiniSprites members={team.members} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
