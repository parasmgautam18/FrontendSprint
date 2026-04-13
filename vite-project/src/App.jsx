import { useState, useCallback } from "react";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const TYPE_COLORS = {
  fire: "#FF6B35", water: "#4FC3F7", grass: "#66BB6A", electric: "#FFEE58",
  psychic: "#F48FB1", ice: "#80DEEA", dragon: "#7C4DFF", dark: "#37474F",
  fairy: "#F8BBD0", fighting: "#EF5350", poison: "#AB47BC", ground: "#BCAAA4",
  rock: "#8D6E63", bug: "#AED581", ghost: "#7E57C2", steel: "#90A4AE",
  normal: "#B0BEC5", flying: "#90CAF9",
};

const StatBar = ({ name, value, max = 255 }) => {
  const pct = Math.round((value / max) * 100);
  const color = pct > 70 ? "#4ade80" : pct > 40 ? "#facc15" : "#f87171";
  return (
    <div className="stat-row">
      <span className="stat-label">{name.toUpperCase()}</span>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="stat-value">{value}</span>
    </div>
  );
};
console.log("Key loaded:", !!import.meta.env.VITE_GROQ_API_KEY);
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="sk sk-circle" />
    <div className="sk sk-title" />
    <div className="sk sk-line" />
    <div className="sk sk-line short" />
    <div className="sk sk-line" />
    <div className="sk sk-line short" />
  </div>
);

export default function App() {
  const [pokemon, setPokemon] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [streamText, setStreamText] = useState("");

  const fetchPokemon = useCallback(async (nameOrId) => {
    setLoading(true);
    setError("");
    setPokemon(null);
    setAnalysis("");
    setStreamText("");
    try {
      const query = nameOrId?.trim().toLowerCase() || Math.floor(Math.random() * 898 + 1);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
      if (!res.ok) throw new Error(`Pokémon "${query}" not found.`);
      const data = await res.json();
      setPokemon(data);
      setLoading(false);
      await analyzeWithGroq(data);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, []);

  const analyzeWithGroq = async (data) => {
    setAiLoading(true);
    setStreamText("");
    const statSummary = data.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join(", ");
    const types = data.types.map(t => t.type.name).join("/");
    const moves = data.moves.slice(0, 5).map(m => m.move.name).join(", ");

    const prompt = `You are a brutally honest, wildly entertaining Pokémon battle analyst with a sharp wit. Analyze this Pokémon's battle potential and give it a personality:

Name: ${data.name}
Type: ${types}
Height: ${data.height / 10}m | Weight: ${data.weight / 10}kg
Stats: ${statSummary}
Some Moves: ${moves}

Your response MUST include:
1. 🏆 BATTLE TIER RATING (S/A/B/C/D with one punchy sentence why)
2. 💪 STRENGTHS (2-3 bullet points, specific to its stats)
3. 😬 WEAKNESSES / ROAST (2-3 bullet points, be savage but accurate)
4. 🧠 PERSONALITY PROFILE (2-3 sentences — what kind of trainer vibes does this Pokémon have?)
5. 🎯 SIGNATURE STRATEGY (One clever battle tactic using its actual stats)

Keep it punchy, fun, and under 300 words. No fluff.`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          max_completion_tokens: 500,
          stream: true,
        }),
      });

      if (!res.ok) {
        throw new Error(`Groq API error: ${res.status} ${res.statusText}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data: ") && l !== "data: [DONE]");
        for (const line of lines) {
          try {
            const json = JSON.parse(line.replace("data: ", ""));
            const delta = json.choices?.[0]?.delta?.content || "";
            full += delta;
            setStreamText(full);
          } catch {}
        }
      }
      setAnalysis(full);
    } catch (e) {
      setAnalysis(`⚠️ Groq analysis failed: ${e.message}`);
    }
    setAiLoading(false);
  };

  const primaryType = pokemon?.types?.[0]?.type?.name || "normal";
  const typeColor = TYPE_COLORS[primaryType] || "#B0BEC5";
  const sprite = pokemon?.sprites?.other?.["official-artwork"]?.front_default || pokemon?.sprites?.front_default;

  return (
    <div className="app">
      <div className="bg-grid" />
      <div className="bg-glow" style={{ background: `radial-gradient(ellipse at 60% 20%, ${typeColor}33 0%, transparent 60%)` }} />

      <header className="header">
        <div className="logo-group">
          <span className="logo-icon">⚡</span>
          <div>
            <h1 className="logo-title">POKÉMON INTEL</h1>
            <p className="logo-sub">AI Battle Analyst · Powered by Groq</p>
          </div>
        </div>
        <div className="search-row">
          <input
            className="search-input"
            placeholder="Enter name or ID..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchPokemon(input)}
          />
          <button className="btn-search" onClick={() => fetchPokemon(input)}>ANALYZE</button>
          <button className="btn-random" onClick={() => { setInput(""); fetchPokemon(); }}>🎲 RANDOM</button>
        </div>
      </header>

      <main className="main">
        {error && <div className="error-card">❌ {error}</div>}

        {loading && <SkeletonCard />}

        {!loading && pokemon && (
          <div className="content-grid">
            {/* Pokémon Card */}
            <div className="poke-card" style={{ "--type-color": typeColor }}>
              <div className="poke-bg-circle" style={{ background: `${typeColor}22` }} />
              <div className="poke-number">#{String(pokemon.id).padStart(3, "0")}</div>
              <img className="poke-sprite" src={sprite} alt={pokemon.name} />
              <h2 className="poke-name">{pokemon.name.toUpperCase()}</h2>
              <div className="type-badges">
                {pokemon.types.map(t => (
                  <span key={t.type.name} className="type-badge" style={{ background: TYPE_COLORS[t.type.name] || "#999" }}>
                    {t.type.name}
                  </span>
                ))}
              </div>
              <div className="poke-meta">
                <div className="meta-item"><span className="meta-val">{pokemon.height / 10}m</span><span className="meta-key">HEIGHT</span></div>
                <div className="meta-divider" />
                <div className="meta-item"><span className="meta-val">{pokemon.weight / 10}kg</span><span className="meta-key">WEIGHT</span></div>
                <div className="meta-divider" />
                <div className="meta-item"><span className="meta-val">{pokemon.base_experience || "?"}</span><span className="meta-key">BASE EXP</span></div>
              </div>
              <div className="stats-section">
                <p className="stats-title">BASE STATS</p>
                {pokemon.stats.map(s => (
                  <StatBar key={s.stat.name} name={s.stat.name.replace("special-", "sp.")} value={s.base_stat} />
                ))}
              </div>
            </div>

            {/* AI Analysis Panel */}
            <div className="analysis-card">
              <div className="analysis-header">
                <span className="ai-badge">🤖 GROQ AI</span>
                <h3 className="analysis-title">BATTLE INTELLIGENCE REPORT</h3>
              </div>
              {aiLoading && !streamText ? (
                <div className="ai-loading">
                  <div className="spinner" />
                  <p>Groq is analyzing battle data...</p>
                </div>
              ) : (
                <div className="analysis-body">
                  <pre className="analysis-text">
                    {(streamText || analysis).split("\n").map((line, i) => {
                      const isHeader = /^[🏆💪😬🧠🎯]/.test(line);
                      const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
                      return (
                        <span key={i} className={isHeader ? "line-header" : isBullet ? "line-bullet" : "line-normal"}>
                          {line}{"\n"}
                        </span>
                      );
                    })}
                    {aiLoading && <span className="cursor-blink">▋</span>}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !pokemon && !error && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2>SEARCH A POKÉMON</h2>
            <p>Enter a name like <em>charizard</em>, <em>mewtwo</em>, or hit 🎲 for a random pick.</p>
            <p className="empty-sub">Groq AI will generate a full battle intelligence report.</p>
          </div>
        )}
      </main>

      <footer className="footer">
        Built with PokeAPI + Groq LLM · Data-to-Intelligence Pipeline
      </footer>
    </div>
  );
}
