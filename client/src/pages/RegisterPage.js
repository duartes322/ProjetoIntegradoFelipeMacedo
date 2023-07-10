import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [birthday, setBirthday] = useState('');
    const [cep, setCep] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');

    async function register(ev){
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({username,password,email,firstname,lastname,birthday,cep,number,complement}),
            headers: {'Content-Type':'application/json'},
        });
        if (response.status === 200) {
            const data = await response.json(); // Extrair os dados da resposta

             const newResponse = await fetch('http://localhost:4000/cardregister', {
                method: 'POST',
                body: JSON.stringify({ id: data._id }), // Passar o ID como objeto JSON
                headers: { 'Content-Type': 'application/json' },
            });
            if (newResponse.status === 200) {
                alert('Cadastrado com sucesso!');
            }
            
        } else {
            alert('Erro ao cadastrar');
        }
    }


        
    return(
        <form className="register" onSubmit={register}>
            <h1>Cadastro</h1>
            <input type="text" 
                placeholder="usuário" 
                value={username} 
                onChange={ev => setUsername(ev.target.value)}/>
            <input type="password" 
                placeholder="senha"
                value={password} 
                onChange={ev => setPassword(ev.target.value)}/>
            <input type="email" 
                placeholder="email"
                value={email} 
                onChange={ev => setEmail(ev.target.value)}/>
            <input type="text" 
                placeholder="nome"
                value={firstname} 
                onChange={ev => setFirstname(ev.target.value)}/>
            <input type="text" 
                placeholder="sobrenome"
                value={lastname} 
                onChange={ev => setLastname(ev.target.value)}/>
            <input type="date" 
                placeholder="data de nascimento"
                value={birthday} 
                onChange={ev => setBirthday(ev.target.value)}/>
            <input type="text" 
                placeholder="cep"
                value={cep} 
                onChange={ev => setCep(ev.target.value)}/>
            <input type="text" 
                placeholder="número"
                value={number} 
                onChange={ev => setNumber(ev.target.value)}/>
            <input type="text" 
                placeholder="complemento"
                value={complement} 
                onChange={ev => setComplement(ev.target.value)}/>
            <button>Register</button>
        </form>

    );
}