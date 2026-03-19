import { useState } from "react";
import axios from "axios";
import Login from "./Login";

export default function Admin() {

  const [logado,setLogado] = useState(false);

  const [nome,setNome] = useState("");
  const [preco,setPreco] = useState("");
  const [foto,setFoto] = useState(null);


  if(!logado){
    return <Login ok={()=>setLogado(true)} />
  }


  async function salvar(){

    let nomeFoto = ""

    if(foto){

      const form = new FormData()

      form.append("foto",foto)

      const r = await axios.post(
        "http://192.168.18.6:3001/upload",
        form
      )

      nomeFoto = r.data.arquivo

    }

    await axios.post(
      "http://192.168.18.6:3001/produtos",
      {
        nome,
        preco,
        foto:nomeFoto
      }
    )

    alert("Salvo")

  }


  return (

    <div>

      <h1>ADMIN</h1>

      <input
        placeholder="nome"
        onChange={e=>setNome(e.target.value)}
      />

      <br/>

      <input
        placeholder="preco"
        onChange={e=>setPreco(e.target.value)}
      />

      <br/>

      <input
        type="file"
        onChange={e=>setFoto(e.target.files[0])}
      />

      <br/>

      <button onClick={salvar}>
        salvar
      </button>

    </div>

  )

}