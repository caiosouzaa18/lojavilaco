import { useState } from "react";
import axios from "axios";

export default function Login({setAdmin}){

  const [user,setUser] = useState("");
  const [pass,setPass] = useState("");

  function entrar(){

    axios.post(
      "http://192.168.18.6:3001/login",
      {user,pass}
    ).then(r=>{

      if(r.data.ok){
        setAdmin(true)
      }else{
        alert("Erro login")
      }

    })

  }

  return(

    <div>

      <h2>Login</h2>

      <input onChange={e=>setUser(e.target.value)} placeholder="usuario"/>
      <input onChange={e=>setPass(e.target.value)} placeholder="senha" type="password"/>

      <button onClick={entrar}>
        Entrar
      </button>

    </div>

  )

}