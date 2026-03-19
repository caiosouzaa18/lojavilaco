import { useEffect, useState } from "react";
import axios from "axios";

import Admin from "./Admin";
import Login from "./Login";
import logo from "./vi.png.png";

export default function App(){

  const [produtos,setProdutos] = useState([]);
  const [carrinho,setCarrinho] = useState([]);
  const [admin,setAdmin] = useState(false);

  const [cep,setCep] = useState("");
  const [frete,setFrete] = useState(0);

/* =======================
   LOAD PRODUTOS
======================= */

  useEffect(()=>{

    axios
      .get("http://localhost:3001/produtos")
      .then(r=>setProdutos(r.data))

  },[])

/* =======================
   CARRINHO
======================= */

  function adicionar(p){

    const existe = carrinho.find(i=>i.id === p.id)

    if(existe){

      setCarrinho(
        carrinho.map(i =>
          i.id === p.id
            ? {...i, q: i.q + 1}
            : i
        )
      )

    }else{

      setCarrinho([...carrinho,{...p,q:1}])

    }

  }

  function menos(p){

    setCarrinho(
      carrinho
        .map(i =>
          i.id === p.id
            ? {...i, q: i.q - 1}
            : i
        )
        .filter(i => i.q > 0)
    )

  }

  function remover(id){
    setCarrinho(carrinho.filter(i=>i.id !== id))
  }

/* =======================
   FRETE
======================= */

  function calcularFrete(){

    if(!cep) return alert("Digite CEP")

    if(cep.startsWith("44")) setFrete(10)
    else if(cep.startsWith("45")) setFrete(15)
    else setFrete(20)

  }

/* =======================
   TOTAL
======================= */

  const total = carrinho.reduce((s,p)=>{

    const preco = Number(
      String(p.preco).replace(",",".")
    )

    return s + preco * p.q

  },0) + frete

/* =======================
   PAGAR
======================= */

  async function pagar(){

    const r = await axios.post(
      "http://localhost:3001/pagar",
      { itens: carrinho }
    )

    window.open(r.data.link)

  }

/* =======================
   WHATSAPP
======================= */

  function whatsapp(){

    let texto = "Pedido:%0A"

    carrinho.forEach(p=>{
      texto += p.nome+" x"+p.q+"%0A"
    })

    texto += "%0ATotal: R$ "+total

    window.open(
      "https://wa.me/557591531302?text="+texto
    )

  }

/* =======================
   LOGIN
======================= */

  if(admin === true) return <Admin/>

  if(admin === "login")
    return <Login setAdmin={setAdmin}/>

/* =======================
   TELA
======================= */

  return(

    <div style={{display:"flex"}}>

      <div style={{width:250,background:"#fff"}}>

        <h3>Carrinho</h3>

        {carrinho.map(p=>(

          <div key={p.id}>
            {p.nome}

            <button onClick={()=>menos(p)}>-</button>
            {p.q}
            <button onClick={()=>adicionar(p)}>+</button>

            <button onClick={()=>remover(p.id)}>X</button>
          </div>

        ))}

        <hr/>

        CEP
        <input onChange={e=>setCep(e.target.value)}/>

        <button onClick={calcularFrete}>
          Calcular
        </button>

        <br/>

        Frete: R$ {frete}

        <hr/>

        Total: R$ {total.toFixed(2)}

        <br/>

        <button onClick={pagar}>
          Pagar no site
        </button>

        <button onClick={whatsapp}>
          WhatsApp
        </button>

      </div>

      <div style={{flex:1}}>

        <div style={{background:"#ff69b4",padding:10}}>

          <img src={logo} width="60"/>

          <button onClick={()=>setAdmin("login")}>
            ADMIN
          </button>

        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))"}}>

          {produtos.map(p=>(

            <div key={p.id}>

              <img
                src={"http://localhost:3001/uploads/"+p.foto}
                width="150"
              />

              <h3>{p.nome}</h3>
              <h3>R$ {p.preco}</h3>

              <button onClick={()=>adicionar(p)}>
                Comprar
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}