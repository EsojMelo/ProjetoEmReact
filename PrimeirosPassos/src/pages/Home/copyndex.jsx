import { useEffect, useState, useRef } from 'react'
import './style.css'
import Trash from '../../assets/redTrash.png'
import {api, apiNative} from '../../services/api'

function Home() {
  const [users, setUsers] = useState([]);

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()
  const InputPassword = useRef()

  function eraseInfo() {
    inputName = null
    inputAge = null
    inputEmail = null
    InputPassword = null
  }

  async function getUsers (){
    const usersData = await api.get('/usuarios')

    setUsers(usersData.data)
  }

  async function creatUsers() {
    try {
      const response = await api.post('/usuarios', {
        name: inputName.current.value,
        password: InputPassword.current.value,
        email: inputEmail.current.value,
        age: parseInt(inputAge.current.value)
      });
  
      alert("Usuário cadastrado com sucesso!");
      getUsers();
      eraseInfo();
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error); // Mostra o erro vindo do backend
      } else {
        alert("Erro ao cadastrar usuário. Tente novamente.");
      }
      eraseInfo();
    }
  }
  
  async function deleteUsers (email){
    await api.delete(`/usuarios/${email}`)
    getUsers()
  }

  useEffect(() => {
    getUsers()
  }, [])
  

  return (
    <div className='container'>
      <form>
        <h1> Cadastro de Usuários</h1>
        <input name='nome' placeholder='Nome' type='text' ref={inputName}></input>
        <input name='senha' placeholder='Senha' type='password' ref={InputPassword}></input>
        <input name='email' placeholder='Email' type='email' ref={inputEmail}></input>
        <input name='idade' placeholder='Idade' type='number' ref={inputAge}></input>
        <button type='button' onClick={creatUsers}>Cadastrar</button>
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Senha: <span>{user.password}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <button onClick={() => deleteUsers(user.email)}>
            <img src={Trash} alt="Lixeira Vermelha" />
          </button>
        </div>
      ))}

    </div>
  )

}

export default Home
