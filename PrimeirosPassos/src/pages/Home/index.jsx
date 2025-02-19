import { useEffect, useState, useRef } from "react";
import "./style.css";
import Trash from "../../assets/redTrash.png";
import { api } from "../../services/api";

function Home() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(""); // Armazena erro geral
  const [successMessage, setSuccessMessage] = useState(""); // Armazena mensagem de sucesso
  const [emailError, setEmailError] = useState(""); // Armazena erro do email

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();
  const inputPassword = useRef();

  function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  async function getUsers() {
    const usersData = await api.get("/usuarios");
    setUsers(usersData.data);
  }

  async function createUser() {
    setError(""); // Limpa erros anteriores
    setEmailError("");

    const name = inputName.current.value;
    const email = inputEmail.current.value;
    const password = inputPassword.current.value;
    const age = inputAge.current.value;

    if (!name || !email || !password || !age) {
      setError("Todos os campos são obrigatórios!");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Formato de e-mail inválido!");
      return;
    }

    try {
      await api.post("/usuarios", {
        name,
        password,
        email,
        age: parseInt(age),
      });

      setSuccessMessage("Usuário cadastrado com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000); // Remove a mensagem após 3 segundos
      getUsers();

      // Limpar os inputs
      inputName.current.value = "";
      inputEmail.current.value = "";
      inputPassword.current.value = "";
      inputAge.current.value = "";
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError("Erro ao cadastrar usuário. Tente novamente.");
      }
    }
  }

  async function deleteUser(email) {
    await api.delete(`/usuarios/${email}`);
    getUsers();
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <form>
        <h1>Cadastro de Usuários</h1>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}

        <input name="nome" placeholder="Nome" type="text" ref={inputName} />
        <input
          name="email"
          placeholder="Email"
          type="email"
          ref={inputEmail}
          onBlur={() => {
            if (!validateEmail(inputEmail.current.value)) {
              setEmailError("Formato de e-mail inválido!");
            } else {
              setEmailError("");
            }
          }}
        />
        {emailError && <p className="error-message">{emailError}</p>}

        <input name="senha" placeholder="Senha" type="password" ref={inputPassword} />
        <input name="idade" placeholder="Idade" type="number" ref={inputAge} />
        <button type="button" onClick={createUser}>
          Cadastrar
        </button>
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>
              Nome: <span>{user.name}</span>
            </p>
            <p>
              Idade: <span>{user.age}</span>
            </p>
            <p>
              Email: <span>{user.email}</span>
            </p>
          </div>
          <button onClick={() => deleteUser(user.email)}>
            <img src={Trash} alt="Lixeira Vermelha" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
