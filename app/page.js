import CalculadoraJurosSimples from "@/components/CalculadoraJurosSimples";

export default function Home() {
  return (
    <div className="ledger-bg min-h-screen">
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-12 sm:py-20">
        <header className="mb-8 w-full text-center sm:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            Sistema de cálculo financeiro · ADS
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Calculadora de <em className="text-brand">Juros Simples</em>
          </h1>
          <p className="mt-3 max-w-md text-ink-soft sm:max-w-none">
            Informe o capital, a taxa e o tempo de aplicação para ver o
            rendimento no regime linear.
          </p>
        </header>

        <CalculadoraJurosSimples />

        <footer className="mt-10 w-full border-t border-line pt-4 text-center font-mono text-xs text-ink-soft">
          <p>J = C × i × t &nbsp;·&nbsp; M = C + J</p>
          <p className="mt-1">aula2008-juros-simples — Next.js + React</p>
        </footer>
      </main>
    </div>
  );
}
