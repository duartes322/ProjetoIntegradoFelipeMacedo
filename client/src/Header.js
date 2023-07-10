import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header(){
  const {setUserInfo, userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include'
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;
  const isAdmin = userInfo?.isAdmin;

  return(
      <header>
      <Link to="/" className="logo">MeuClube</Link>
      <nav>
        {isAdmin && (
          <>
            <Link to="/admin">Admin</Link>
            <Link to="/create">Nova postagem</Link>
          </>
        )}
        <Link to="/news">Novidades</Link>
        {username && (
          <>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Cadastro</Link>
          </>
        )}
      </nav>
    </header>
  );
}