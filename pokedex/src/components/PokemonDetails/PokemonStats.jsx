import { useState, useEffect } from "react";
import "./PokemonStats.css";

const MAX_STAT = 255;

const STAT_NAMES = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

const getBarColor = (v) =>
  v < 50 ? "#d7a19d" : v < 100 ? "#d46161" : v < 150 ? "#f94848" : "#ff0000";

function StatBar({ name, value }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth((value / MAX_STAT) * 100), 300);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="stat-row">
      <span className="stat-name">{STAT_NAMES[name] ?? name}</span>
      <span className="stat-value">{value}</span>
      <div className="bar-container">
        <div
          className="bar-fill"
          style={{ width: `${width}%`, backgroundColor: getBarColor(value) }}
        />
      </div>
    </div>
  );
}

function PokemonStats({ stats = [] }) {
  if (!stats.length) return <div className="stats-loading">Loading stats...</div>;

  const total = stats.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="stats-wrapper">
      <div className="stats-header">
        <h3>Base stats</h3>
        <span className="total">Total: {total}</span>
      </div>
      {stats.map((s) => (
        <StatBar key={s.name} name={s.name} value={s.value} />
      ))}
    </div>
  );
}

export default PokemonStats;