import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./RegisterAndLogin.scss";

const Login = () => {
  const [accountSystem, setAccountSystem] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const Login = (e) => {
    e.preventDefault();
  };

  return (
    <div className="register-or-login-page">
      {/* Register area */}
      <div className="register-or-login-area">
        <div className="container">
          <div className="form-area">
            <form onSubmit={Login}>
              <h2>FotoIn</h2>

              <input
                type="text"
                name="accountSystem"
                placeholder="No telepon atau email"
                value={accountSystem}
                onChange={(e) => setAccountSystem(e.target.value)}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {msg && <p className="error-msg">{msg}</p>}

              <button type="button">Daftar</button>

              <p className="login-question">
                Belum punya akun? <Link to="/register">Register</Link>
              </p>

              <div className="line"></div>
            </form>
          </div>

          <div className="image-area">
            <img src="./img/icon.png" alt="Astronot" />
          </div>
        </div>
      </div>

      {/* Footer area */}

      <footer>
        <div className="container">
          <div className="logo">
            <h4>Fotoin</h4>
          </div>

          <div className="footer-list">
            <h5>Tentang Fotoin</h5>
            <ul>
              <li>
                <Link to="">Owner</Link>
              </li>
              <li>
                <Link to="">Contact</Link>
              </li>
              <li>
                <Link to="">Iklan dan promosi</Link>
              </li>
            </ul>
          </div>

          <div className="footer-list">
            <h5>Best accounts</h5>
            <ul>
              <li>
                <Link to="">Follower</Link>
              </li>
              <li>
                <Link to="">Postingan</Link>
              </li>
              <li>
                <Link to="">Like</Link>
              </li>
              <li>
                <Link to="">Comment</Link>
              </li>
              <li>
                <Link to="">1st birthday Fotoin awards</Link>
              </li>
            </ul>
          </div>

          <div className="footer-list">
            <h5>Made with</h5>
            <ul>
              <li>
                <Link to="">NodeJS</Link>
              </li>
              <li>
                <Link to="">ExpressJS</Link>
              </li>
              <li>
                <Link to="">ReactJS</Link>
              </li>
              <li>
                <Link to="">MongoDB</Link>
              </li>
              <li>
                <Link to="">Sass</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
