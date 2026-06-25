import { useState } from "react";

const PRIVATE_SERVER_LINK =
  "https://roblox.com.ug/games/142823291/Murder-Mystery-2?privateServerLinkCode=03244819970514690360987911532867";

interface Knife {
  id: number;
  name: string;
  tier: "Godly" | "Ancient" | "Legendary" | "Rare" | "Uncommon" | "Common";
  value: number;
  donated: number;
  img: string;
  description: string;
}

const TIER_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  Godly:     { bg: "#7c1fa8",   text: "#e9a3ff", border: "#a855f7", glow: "rgba(168,85,247,0.35)" },
  Ancient:   { bg: "#b91c1c",   text: "#fca5a5", border: "#ef4444", glow: "rgba(239,68,68,0.35)"  },
  Legendary: { bg: "#b45309",   text: "#fcd34d", border: "#f59e0b", glow: "rgba(245,158,11,0.35)" },
  Rare:      { bg: "#1e40af",   text: "#93c5fd", border: "#3b82f6", glow: "rgba(59,130,246,0.25)" },
  Uncommon:  { bg: "#065f46",   text: "#6ee7b7", border: "#10b981", glow: "rgba(16,185,129,0.20)" },
  Common:    { bg: "#374151",   text: "#d1d5db", border: "#6b7280", glow: "rgba(107,114,128,0.15)" },
};

const KNIVES: Knife[] = [
  { id: 1, name: "Chroma Laser",     tier: "Godly",     value: 80,  donated: 342, img: "/ugc-1.png", description: "Laser com efeito chroma animado." },
  { id: 2, name: "Corruption",       tier: "Ancient",   value: 160, donated: 91,  img: "/ugc-2.png", description: "A faca mais sombria dos Ancients." },
  { id: 3, name: "Elderwood Scythe", tier: "Legendary", value: 45,  donated: 218, img: "/ugc-3.png", description: "Foice lendária do bosque eterno." },
  { id: 4, name: "Shark",            tier: "Godly",     value: 70,  donated: 503, img: "/ugc-4.png", description: "Faca Godly clássica e muito popular." },
  { id: 5, name: "Ghostblade",       tier: "Legendary", value: 40,  donated: 177, img: "/ugc-5.png", description: "A lâmina dos fantasmas do MM2." },
  { id: 6, name: "Batwing",          tier: "Rare",      value: 12,  donated: 870, img: "/ugc-6.png", description: "Rara com visual de asa de morcego." },
  { id: 7, name: "Sunrise",          tier: "Godly",     value: 65,  donated: 290, img: "/ugc-1.png", description: "Godly com gradiente dourado." },
  { id: 8, name: "Darkbringer",      tier: "Ancient",   value: 200, donated: 45,  img: "/ugc-2.png", description: "Ancient mais raro do jogo." },
];

const TIERS = ["Todos", "Ancient", "Godly", "Legendary", "Rare", "Uncommon", "Common"];

const STATS = [
  { label: "Facas Doadas",    value: "25.000+" },
  { label: "Doadores Ativos", value: "1.200+"  },
  { label: "Godlys Doados",   value: "3.800+"  },
  { label: "Ancients Doados", value: "420+"    },
];

/* ── icons ── */
function SwordIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
      <line x1="13" y1="19" x2="19" y2="13"/>
      <line x1="16" y1="16" x2="20" y2="20"/>
      <line x1="19" y1="21" x2="21" y2="19"/>
    </svg>
  );
}
function SkullIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a8 8 0 0 0-8 8c0 3.5 2 6.5 5 7.5V20h2v2h2v-2h2v-2h1v-2.5c3-1 5-4 5-7.5a8 8 0 0 0-8-8z"/>
      <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function GiftIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  );
}
function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function FlameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  );
}
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

/* ── Modal ── */
function DonationModal({ knife, onClose }: { knife: Knife; onClose: () => void }) {
  const t = TIER_COLORS[knife.tier];
  const steps = [
    "Clique no botão abaixo para entrar no servidor privado",
    "Me encontre dentro do jogo (procure o dono do servidor)",
    "Me avise qual faca você quer e ela é sua!",
  ];

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #12121c 0%, #0d0d14 100%)",
          border: `1px solid ${t.border}55`,
          boxShadow: `0 0 60px ${t.glow}, 0 0 0 1px ${t.border}22`,
        }}
      >
        {/* top glow strip */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${t.border}, transparent)` }} />

        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
          style={{ color: "#64748b", background: "rgba(255,255,255,0.05)" }}
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* knife preview */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 relative"
              style={{ background: "#0a0a12", border: `1px solid ${t.border}44` }}
            >
              <img src={knife.img} alt={knife.name} className="w-full h-full object-cover" />
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle, ${t.glow} 0%, transparent 70%)` }}
              />
            </div>
            <div>
              <div
                className="inline-block text-xs font-black px-2.5 py-0.5 rounded-full mb-1"
                style={{ background: `${t.bg}dd`, color: t.text, border: `1px solid ${t.border}66` }}
              >
                {knife.tier}
              </div>
              <h2 className="text-xl font-black text-white">{knife.name}</h2>
              <div className="flex items-center gap-1 mt-0.5">
                <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm">{knife.value}</span>
                <span className="text-gray-500 text-xs">de valor</span>
              </div>
            </div>
          </div>

          {/* steps */}
          <div
            className="rounded-2xl p-4 mb-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#64748b" }}>
              Como receber
            </p>
            <div className="flex flex-col gap-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black mt-0.5"
                    style={{ background: `${t.bg}aa`, color: t.text, border: `1px solid ${t.border}55` }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-300 leading-snug">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href={PRIVATE_SERVER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full font-black py-4 rounded-2xl text-base transition-all"
            style={{
              background: `linear-gradient(135deg, #c41e3a, #7c1fa8)`,
              color: "white",
              boxShadow: "0 0 30px rgba(196,30,58,0.5)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 40px rgba(196,30,58,0.7)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.01)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(196,30,58,0.5)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
            }}
          >
            <SkullIcon className="w-5 h-5" />
            Entrar no Servidor Privado
            <ArrowRightIcon className="w-4 h-4" />
          </a>

          {/* tip */}
          <div className="flex items-center gap-2 mt-3 justify-center">
            <CheckIcon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            <p className="text-xs" style={{ color: "#4b5563" }}>
              100% grátis · Nenhum pagamento necessário
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Knife card ── */
function KnifeCard({ knife, onPedir }: { knife: Knife; onPedir: (k: Knife) => void }) {
  const t = TIER_COLORS[knife.tier];
  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      style={{
        background: `linear-gradient(145deg, ${t.bg}22 0%, #0d0d14 60%)`,
        border: `1px solid ${t.border}44`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 32px ${t.glow}, 0 0 0 1px ${t.border}66`;
        (e.currentTarget as HTMLDivElement).style.borderColor = `${t.border}99`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.borderColor = `${t.border}44`;
      }}
    >
      {/* decorative glow orb */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-30 pointer-events-none"
        style={{ background: t.border }}
      />

      <div className="relative p-5 flex flex-col gap-4">
        {/* tier badge */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-black px-2.5 py-0.5 rounded-full tracking-wide uppercase"
            style={{ background: `${t.bg}ee`, color: t.text, border: `1px solid ${t.border}66` }}
          >
            {knife.tier}
          </span>
          <div className="flex items-center gap-1">
            <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-yellow-300 font-black text-sm">{knife.value}</span>
          </div>
        </div>

        {/* knife name — big and beautiful */}
        <div>
          <h3
            className="font-black text-xl leading-tight"
            style={{ color: t.text, textShadow: `0 0 20px ${t.border}88` }}
          >
            {knife.name}
          </h3>
          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#4b5563" }}>
            {knife.description}
          </p>
        </div>

        {/* divider */}
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${t.border}44, transparent)` }} />

        {/* footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <GiftIcon className="w-3.5 h-3.5" style={{ color: t.text }} />
            <span className="text-xs" style={{ color: "#4b5563" }}>{knife.donated} doados</span>
          </div>
          <button
            onClick={() => onPedir(knife)}
            className="text-xs font-black px-4 py-1.5 rounded-xl transition-all active:scale-95"
            style={{ background: t.bg, color: t.text, border: `1px solid ${t.border}88` }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 16px ${t.glow}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            Pedir →
          </button>
        </div>
      </div>
    </div>
  );
}

async function logKnifeRequest(knife: Knife) {
  try {
    const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
    await fetch(`${BASE}/api/log/knife-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ knifeName: knife.name, tier: knife.tier, username: "Anônimo" }),
    });
  } catch { /* silently ignore */ }
}

/* ── Page ── */
export default function Home() {
  const [activeTier, setActiveTier] = useState("Todos");
  const [search, setSearch]         = useState("");
  const [selectedKnife, setSelectedKnife] = useState<Knife | null>(null);

  function handlePedir(knife: Knife) {
    setSelectedKnife(knife);
    logKnifeRequest(knife);
  }

  const filtered = KNIVES.filter((k) => {
    const matchTier   = activeTier === "Todos" || k.tier === activeTier;
    const matchSearch = k.name.toLowerCase().includes(search.toLowerCase());
    return matchTier && matchSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: "#080810", color: "#e2e8f0" }}>

      {/* MODAL */}
      {selectedKnife && (
        <DonationModal knife={selectedKnife} onClose={() => setSelectedKnife(null)} />
      )}

      {/* NAV */}
      <nav
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ background: "#08081099", borderColor: "#c41e3a33" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #c41e3a, #7c1fa8)" }}>
              <SkullIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl text-white">MM2</span>
            <span className="font-black text-xl" style={{ color: "#ef4444" }}>Doações</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold" style={{ color: "#94a3b8" }}>
            <a href="#facas"   className="hover:text-white transition-colors">Facas</a>
            <a href="#como"    className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#ranking" className="hover:text-white transition-colors">Top Doadores</a>
          </div>

          <button
            onClick={() => handlePedir(KNIVES[0])}
            className="hidden sm:flex items-center gap-2 text-sm font-black px-5 py-2 rounded-xl transition-all"
            style={{ background: "linear-gradient(135deg, #c41e3a, #991b1b)", color: "white", boxShadow: "0 0 20px rgba(196,30,58,0.4)" }}
          >
            <GiftIcon className="w-4 h-4" /> Pedir Faca
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative px-4 sm:px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, #c41e3a 0%, #7c1fa8 60%, transparent 100%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 50% 0%, rgba(196,30,58,0.08) 0%, transparent 60%)" }} />

        <div className="max-w-3xl mx-auto text-center relative">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-6"
            style={{ background: "rgba(196,30,58,0.12)", border: "1px solid rgba(196,30,58,0.3)", color: "#fca5a5" }}
          >
            <FlameIcon className="w-3.5 h-3.5 text-red-400" />
            Comunidade Brasileira de MM2
          </div>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4 leading-[1.05]">
            Ganhe Facas Grátis
            <br />
            <span style={{ background: "linear-gradient(90deg, #ef4444, #c026d3)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Murder Mystery 2
            </span>
          </h1>

          <p className="text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "#94a3b8" }}>
            Receba doações de facas raras, Godlys e Ancients sem precisar pagar nada.
            Nossa comunidade doa para quem mais precisa!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#facas"
              className="flex items-center justify-center gap-2 font-black px-8 py-3.5 rounded-xl transition-all"
              style={{ background: "linear-gradient(135deg, #c41e3a, #991b1b)", color: "white", boxShadow: "0 0 24px rgba(196,30,58,0.5)" }}
            >
              <SwordIcon className="w-4 h-4" /> Ver Facas Disponíveis
            </a>
            <a
              href="#como"
              className="flex items-center justify-center gap-2 font-bold px-8 py-3.5 rounded-xl transition-all"
              style={{ background: "rgba(255,255,255,0.05)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Como Funciona
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-4 sm:px-6 pb-14">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(({ label, value }) => (
            <div key={label} className="rounded-2xl p-5 text-center"
              style={{ background: "#10101c", border: "1px solid rgba(196,30,58,0.18)" }}>
              <div className="text-3xl font-black text-white">{value}</div>
              <div className="text-sm mt-0.5" style={{ color: "#64748b" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como" className="px-4 sm:px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-2">Como Funciona</h2>
          <p className="text-sm mb-8" style={{ color: "#64748b" }}>Simples, rápido e sem custo</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Escolha a faca", desc: "Navegue pelo catálogo e escolha a faca que deseja receber.", icon: SwordIcon },
              { step: "02", title: "Clique em Pedir", desc: "Um modal vai aparecer com o botão para entrar no servidor privado.", icon: GiftIcon },
              { step: "03", title: "Receba no MM2", desc: "Entre no servidor, encontre o dono e receba sua faca grátis!", icon: SkullIcon },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="rounded-2xl p-6 relative overflow-hidden"
                style={{ background: "#10101c", border: "1px solid rgba(196,30,58,0.15)" }}>
                <div className="text-6xl font-black absolute top-4 right-4 opacity-5 text-red-500 select-none">{step}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(196,30,58,0.15)", border: "1px solid rgba(196,30,58,0.3)" }}>
                  <Icon className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="font-black text-white mb-1">{title}</h3>
                <p className="text-sm" style={{ color: "#64748b" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KNIVES GRID */}
      <section id="facas" className="px-4 sm:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-black text-white">Facas Disponíveis</h2>
              <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>Clique em "Pedir" e entre no servidor privado</p>
            </div>
            <input
              type="search"
              placeholder="Buscar faca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl px-4 py-2.5 text-sm w-full sm:w-56 focus:outline-none transition-all"
              style={{ background: "#10101c", border: "1px solid rgba(196,30,58,0.25)", color: "white" }}
            />
          </div>

          {/* Tier Filter */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
            {TIERS.map((tier) => {
              const isActive = activeTier === tier;
              const t = tier !== "Todos" ? TIER_COLORS[tier] : null;
              return (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className="whitespace-nowrap px-4 py-1.5 rounded-xl text-xs font-black transition-all"
                  style={isActive
                    ? { background: t ? `${t.bg}dd` : "rgba(196,30,58,0.7)", color: t ? t.text : "white", border: `1px solid ${t ? t.border : "#ef4444"}88`, boxShadow: `0 0 14px ${t ? t.glow : "rgba(196,30,58,0.4)"}` }
                    : { background: "#10101c", color: "#64748b", border: "1px solid rgba(255,255,255,0.07)" }
                  }
                >
                  {tier}
                </button>
              );
            })}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((knife) => (
                <KnifeCard key={knife.id} knife={knife} onPedir={handlePedir} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24" style={{ color: "#374151" }}>
              <SwordIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-bold">Nenhuma faca encontrada</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA doador */}
      <section id="ranking" className="px-4 sm:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(196,30,58,0.12) 0%, rgba(124,31,168,0.12) 100%)", border: "1px solid rgba(196,30,58,0.25)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle at 50% 0%, rgba(196,30,58,0.12) 0%, transparent 60%)" }} />
            <SkullIcon className="w-14 h-14 mx-auto mb-4 relative" style={{ color: "#ef4444" }} />
            <h2 className="text-3xl font-black text-white mb-2 relative">Quer Ser Doador?</h2>
            <p className="mb-8 max-w-lg mx-auto relative" style={{ color: "#94a3b8" }}>
              Ajude a comunidade doando facas que você não usa mais. Seja reconhecido como um dos melhores doadores!
            </p>
            <button
              className="inline-flex items-center gap-2 font-black px-8 py-3.5 rounded-xl transition-all relative"
              style={{ background: "linear-gradient(135deg, #c41e3a, #7c1fa8)", color: "white", boxShadow: "0 0 28px rgba(196,30,58,0.5)" }}
            >
              <GiftIcon className="w-4 h-4" /> Quero Ser Doador
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t px-4 sm:px-6 py-8" style={{ borderColor: "rgba(196,30,58,0.15)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #c41e3a, #7c1fa8)" }}>
              <SkullIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white">MM2</span>
            <span className="font-black" style={{ color: "#ef4444" }}>Doações</span>
          </div>
          <p className="text-xs" style={{ color: "#374151" }}>
            Não afiliado à Roblox Corporation ou ao jogo Murder Mystery 2. Site fan-made.
          </p>
          <div className="flex gap-4 text-sm" style={{ color: "#374151" }}>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
