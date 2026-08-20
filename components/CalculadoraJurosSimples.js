"use client";

import { useState } from "react";

const formatarMoeda = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Regra de juros simples: J = C * i * t
 * Antes de calcular, o tempo é convertido para a mesma unidade da taxa
 * (mês ou ano), assim o resultado fica correto mesmo que o aluno informe
 * a taxa ao mês e o tempo em anos, por exemplo.
 */
function calcularJurosSimples({ capital, taxa, taxaPeriodo, tempo, tempoPeriodo }) {
  let tempoConvertido = tempo;

  if (taxaPeriodo === "mes" && tempoPeriodo === "anos") {
    tempoConvertido = tempo * 12;
  } else if (taxaPeriodo === "ano" && tempoPeriodo === "meses") {
    tempoConvertido = tempo / 12;
  }

  const i = taxa / 100;
  const juros = capital * i * tempoConvertido;
  const montante = capital + juros;

  return { juros, montante };
}

function Campo({ numero, label, htmlFor, children }) {
  return (
    <div className="mb-5">
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline gap-2">
        <span className="font-mono text-xs text-ink-soft/70">{numero}</span>
        <span className="text-sm font-medium text-ink">{label}</span>
      </label>
      {children}
    </div>
  );
}

function LinhaResultado({ label, valor, ativo, pulsar, destaque }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-mono text-xs uppercase tracking-[0.15em] text-lcd-fg-dim">
        {label}
      </span>
      <span
        data-idle={!ativo}
        className={`lcd-digits font-mono font-bold ${
          destaque ? "text-2xl sm:text-3xl" : "text-lg"
        } ${pulsar ? "is-updating" : ""}`}
      >
        {valor}
      </span>
    </div>
  );
}

export default function CalculadoraJurosSimples() {
  const [capital, setCapital] = useState("");
  const [taxa, setTaxa] = useState("");
  const [taxaPeriodo, setTaxaPeriodo] = useState("mes");
  const [tempo, setTempo] = useState("");
  const [tempoPeriodo, setTempoPeriodo] = useState("meses");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const [pulsar, setPulsar] = useState(false);

  function aoEnviar(evento) {
    evento.preventDefault();

    const c = Number(capital);
    const t = Number(taxa);
    const p = Number(tempo);

    if (!capital || !taxa || !tempo || c <= 0 || t <= 0 || p <= 0) {
      setErro("Preencha capital, taxa e tempo com valores maiores que zero.");
      setResultado(null);
      return;
    }

    setErro("");
    const { juros, montante } = calcularJurosSimples({
      capital: c,
      taxa: t,
      taxaPeriodo,
      tempo: p,
      tempoPeriodo,
    });

    setResultado({ juros, montante });
    setPulsar(true);
    setTimeout(() => setPulsar(false), 420);
  }

  function limparCampos() {
    setCapital("");
    setTaxa("");
    setTempo("");
    setTaxaPeriodo("mes");
    setTempoPeriodo("meses");
    setResultado(null);
    setErro("");
  }

  return (
    <div className="w-full">
      <form
        onSubmit={aoEnviar}
        noValidate
        className="relative w-full overflow-hidden rounded-lg border border-line bg-paper-card p-6 shadow-sm sm:p-8"
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-brand" aria-hidden="true" />

        <Campo numero="01" label="Capital inicial" htmlFor="capital">
          <div className="flex items-center gap-2 rounded-md border border-line bg-paper px-3 transition-colors focus-within:border-brand">
            <span className="font-mono text-sm text-ink-soft">R$</span>
            <input
              id="capital"
              name="capital"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              className="w-full bg-transparent py-2.5 font-mono text-ink outline-none placeholder:text-ink-soft/50"
            />
          </div>
        </Campo>

        <Campo numero="02" label="Taxa de juros" htmlFor="taxa">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-md border border-line bg-paper px-3 transition-colors focus-within:border-brand">
              <input
                id="taxa"
                name="taxa"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0,0"
                value={taxa}
                onChange={(e) => setTaxa(e.target.value)}
                className="w-full bg-transparent py-2.5 font-mono text-ink outline-none placeholder:text-ink-soft/50"
              />
              <span className="font-mono text-sm text-ink-soft">%</span>
            </div>
            <select
              value={taxaPeriodo}
              onChange={(e) => setTaxaPeriodo(e.target.value)}
              aria-label="Período da taxa de juros"
              className="rounded-md border border-line bg-paper px-3 py-2.5 font-mono text-sm text-ink outline-none transition-colors focus-visible:border-brand"
            >
              <option value="mes">ao mês</option>
              <option value="ano">ao ano</option>
            </select>
          </div>
        </Campo>

        <Campo numero="03" label="Tempo de aplicação" htmlFor="tempo">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex flex-1 items-center rounded-md border border-line bg-paper px-3 transition-colors focus-within:border-brand">
              <input
                id="tempo"
                name="tempo"
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                placeholder="0"
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                className="w-full bg-transparent py-2.5 font-mono text-ink outline-none placeholder:text-ink-soft/50"
              />
            </div>
            <select
              value={tempoPeriodo}
              onChange={(e) => setTempoPeriodo(e.target.value)}
              aria-label="Unidade de tempo"
              className="rounded-md border border-line bg-paper px-3 py-2.5 font-mono text-sm text-ink outline-none transition-colors focus-visible:border-brand"
            >
              <option value="meses">meses</option>
              <option value="anos">anos</option>
            </select>
          </div>
        </Campo>

        {erro && (
          <p role="alert" className="-mt-1 mb-4 font-mono text-sm text-accent">
            {erro}
          </p>
        )}

        <div className="my-5 border-t border-dashed border-line" aria-hidden="true" />

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={limparCampos}
            className="text-sm text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-ink"
          >
            Limpar campos
          </button>
          <button
            type="submit"
            className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold tracking-wide text-paper-card transition-colors hover:bg-brand-dark"
          >
            Calcular
          </button>
        </div>
      </form>

      <div className="lcd-panel mt-6 w-full rounded-lg p-6 sm:p-7">
        <LinhaResultado
          label="Juros"
          valor={resultado ? formatarMoeda(resultado.juros) : "R$ 0,00"}
          ativo={!!resultado}
          pulsar={pulsar}
        />
        <div className="my-4 h-px bg-lcd-bezel" aria-hidden="true" />
        <LinhaResultado
          label="Montante"
          valor={resultado ? formatarMoeda(resultado.montante) : "R$ 0,00"}
          ativo={!!resultado}
          pulsar={pulsar}
          destaque
        />
      </div>
    </div>
  );
}
