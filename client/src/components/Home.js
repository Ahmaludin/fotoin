import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "./Home.scss";

const Home = () => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [tokenExpire, setTokenExpire] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  // const refreshToken = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/token");
  //     setToken(response.data.accessToken);

  //     const tokenDecode = jwtDecode(response.data.accessToken);
  //     setUsername(tokenDecode.username);
  //     setTokenExpire(tokenDecode.exp);
  //   } catch (error) {
  //     error.response && navigate("/login");
  //     console.log(error.response);
  //   }
  // };

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      console.log(decoded);
      setUsername(decoded.username);
      setTokenExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/login");
      }
    }
  };

  const inputComment = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="home-page">
      <div className="container">
        <nav>
          <h1>
            <Link to="/">FotoIn</Link>
          </h1>
          <h3>Selamat siang! Ahmaludin.</h3>
        </nav>

        <main>
          <div className="posts">
            <div className="post">
              {/* foto profil dan username postingan user */}
              <div className="user-post">
                <div className="profile-photo">
                  <img src="./img/icon.jpg" alt="User post profile photo" />
                </div>
                <div className="username">
                  <p>neneng_rospita26</p>
                </div>
              </div>

              {/* foto postingan */}
              <div className="user-post-photos">
                <img src="./img/icon.jpg" alt="User post foto" />
              </div>

              {/* tombol interaksi, like, comment, share */}
              <div className="interact-button">
                <button className="like-btn">
                  <span class="material-symbols-outlined">favorite</span>
                </button>
                <button className="comment-btn">
                  <span class="material-symbols-outlined">forum</span>
                </button>
                <button className="share-btn">
                  <span class="material-symbols-outlined">share</span>
                </button>
              </div>

              {/* jumlah like */}
              <div className="likes">
                <p>2928 likes</p>
              </div>

              {/* captions */}
              <div className="captions">
                <p>
                  <span>neneng_rospita26 </span>Postingan pertama di website
                  fotoin. Ahmal kereeen @ahmaludin
                </p>
              </div>

              {/* jumlah komen */}
              <div className="view-comment">
                <p>Lihat semua 92 komen</p>
              </div>

              {/* input komen */}
              <div className="input-comment">
                <form>
                  <textarea
                    name="add-comment"
                    placeholder="Tambahkan komentar..."
                    onChange={inputComment}
                  ></textarea>
                  <button type="submit">Kirim</button>
                </form>
              </div>
            </div>
            <div className="post">
              {/* foto profil dan username postingan user */}
              <div className="user-post">
                <div className="profile-photo">
                  <img src="./img/icon.jpg" alt="User post profile photo" />
                </div>
                <div className="username">
                  <p>neneng_rospita26</p>
                </div>
              </div>

              {/* foto postingan */}
              <div className="user-post-photos">
                <img src="./img/icon.jpg" alt="User post foto" />
              </div>

              {/* tombol interaksi, like, comment, share */}
              <div className="interact-button">
                <button className="like-btn">
                  <span class="material-symbols-outlined">favorite</span>
                </button>
                <button className="comment-btn">
                  <span class="material-symbols-outlined">forum</span>
                </button>
                <button className="share-btn">
                  <span class="material-symbols-outlined">share</span>
                </button>
              </div>

              {/* jumlah like */}
              <div className="likes">
                <p>2928 likes</p>
              </div>

              {/* captions */}
              <div className="captions">
                <p>
                  <span>neneng_rospita26 </span>Postingan pertama di website
                  fotoin. Ahmal kereeen @ahmaludin
                </p>
              </div>

              {/* jumlah komen */}
              <div className="view-comment">
                <p>Lihat semua 92 komen</p>
              </div>

              {/* input komen */}
              <div className="input-comment">
                <form>
                  <textarea
                    name="add-comment"
                    placeholder="Tambahkan komentar..."
                    onChange={inputComment}
                  ></textarea>
                  <button type="submit">Kirim</button>
                </form>
              </div>
            </div>
          </div>

          <div className="menu">
            <button className="user">
              <span class="material-symbols-outlined">account_circle</span>
              <p>Akun</p>
            </button>

            <button className="home">
              <span class="material-symbols-outlined">home</span>
              <p>Home</p>
            </button>

            <button className="search">
              <span class="material-symbols-outlined">search</span>
              <p>Search</p>
            </button>

            <button className="setting">
              <span class="material-symbols-outlined">menu</span>
              <p>Setting</p>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
