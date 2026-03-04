import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { PieChart, Pie, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

function App() {
  const [senha, setSenha] = useState("");
  const [logado, setLogado] = useState(false);
  const SENHA = "imobisul2026";

  const [processos, setProcessos] = useState([]);
  const [novo, setNovo] = useState({
    numero: "",
    requerente: "",
    data: "",
    vencimento: "",
    serventia: "",
    tipo: "",
    status: "Em andamento",
    valor: "",
    honorarios: ""
  });

  useEffect(() => {
    const salvo = localStorage.getItem("imobisul");
    if (salvo) setProcessos(JSON.parse(salvo));
  }, []);

  useEffect(() => {
    localStorage.setItem("imobisul", JSON.stringify(processos));
  }, [processos]);

  const salvar = () => {
    if (!novo.numero) return;
    setProcessos([...processos, novo]);
    setNovo({
      numero: "",
      requerente: "",
      data: "",
      vencimento: "",
      serventia: "",
      tipo: "",
      status: "Em andamento",
      valor: "",
      honorarios: ""
    });
  };

  const excluir = (i) => {
    setProcessos(processos.filter((_, index) => index !== i));
  };

  const total = useMemo(() =>
    processos.reduce((t, p) => t + (parseFloat(p.valor) || 0), 0)
  , [processos]);

  const totalPago = useMemo(() =>
    processos.reduce((t, p) => t + (parseFloat(p.honorarios) || 0), 0)
  , [processos]);

  const dadosMensais = useMemo(() => {
    const meses = {};
    processos.forEach(p => {
      if (p.data) {
        const mes = p.data.slice(0,7);
        meses[mes] = (meses[mes] || 0) + (parseFloat(p.valor) || 0);
      }
    });
    return Object.keys(meses).map(k => ({ name: k, valor: meses[k] }));
  }, [processos]);

  if (!logado) {
    return (
      <div style={{padding:40,textAlign:"center"}}>
        <h2>Imobisul - Acesso Restrito</h2>
        <input type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} />
        <br/><br/>
        <button onClick={()=> senha===SENHA ? setLogado(true) : alert("Senha incorreta")}>
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div style={{padding:20,fontFamily:"Arial"}}>
      <h1>Imobisul - Sistema de Processos</h1>

      <h3>Novo Processo</h3>
      <input placeholder="Número" value={novo.numero} onChange={e=>setNovo({...novo,numero:e.target.value})}/>
      <input placeholder="Requerente" value={novo.requerente} onChange={e=>setNovo({...novo,requerente:e.target.value})}/>
      <input type="date" value={novo.data} onChange={e=>setNovo({...novo,data:e.target.value})}/>
      <input type="date" value={novo.vencimento} onChange={e=>setNovo({...novo,vencimento:e.target.value})}/>
      <input placeholder="Serventia" value={novo.serventia} onChange={e=>setNovo({...novo,serventia:e.target.value})}/>
      <input placeholder="Tipo" value={novo.tipo} onChange={e=>setNovo({...novo,tipo:e.target.value})}/>
      <input placeholder="Status" value={novo.status} onChange={e=>setNovo({...novo,status:e.target.value})}/>
      <input type="number" placeholder="Valor" value={novo.valor} onChange={e=>setNovo({...novo,valor:e.target.value})}/>
      <input type="number" placeholder="Honorários pagos" value={novo.honorarios} onChange={e=>setNovo({...novo,honorarios:e.target.value})}/>
      <br/><br/>
      <button onClick={salvar}>Salvar</button>

      <h3>Resumo Financeiro</h3>
      <p>Total Geral: R$ {total.toFixed(2)}</p>
      <p>Total Honorários Pagos: R$ {totalPago.toFixed(2)}</p>
      <p>Saldo: R$ {(total-totalPago).toFixed(2)}</p>

      <h3>Controle Mensal</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={dadosMensais}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="valor" />
        </BarChart>
      </ResponsiveContainer>

      <h3>Processos</h3>
      {processos.map((p,i)=>(
        <div key={i} style={{border:"1px solid #ccc",marginBottom:10,padding:10}}>
          <strong>{p.numero}</strong> - {p.requerente} <br/>
          Valor: R$ {p.valor} | Honorários: R$ {p.honorarios} <br/>
          <button onClick={()=>excluir(i)}>Excluir</button>
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
