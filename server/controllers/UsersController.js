import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import Users from "../models/UsersModel.js";

// FUNCTION GET USERS
export const getUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

// FUNCTION REGISTER
export const Register = async (req, res) => {
  // destructuring data dari form register
  const { accountSystem, name, username, password, confPassword } = req.body;

  accountSystem.toLowerCase();
  username.toLowerCase();

  // validasi username
  if (!validator.matches(username, /^[a-zA-Z0-9_.]+$/))
    return res.status(400).json({
      msg: "Username hanya boleh berisi huruf, angka, garis bawah, dan tanda titik",
    });

  // cek username terdaftar
  if (await Users.findOne({ username }))
    return res.status(400).json({ msg: "Username tidak tersedia" });

  // cek match password
  if (password !== confPassword)
    return res.status(400).json({ msg: "Password harus sama" });

  // validasi password
  if (!validator.matches(password, /^[a-zA-Z0-9!@#$%]{8,}$/))
    return res.status(400).json({
      msg: "Password harus terdiri dari minimal 8 karakter huruf besar, huruf kecil, angka, dan simbol (!@#$%)",
    });

  // melakukan hash password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  // pengecekan form yang diisi oleh pengguna apakah no.handphone atau email
  const isInputNumeric = validator.isNumeric(accountSystem);
  let newUser = {};
  let phone_number = "";
  let email = "";

  // validasi jika menggunakan no hp
  if (isInputNumeric) {
    phone_number = accountSystem;
    if (!validator.isMobilePhone(phone_number, "any"))
      return res.status(400).json({ msg: "No handphone harus valid" });
    if (await Users.findOne({ phone_number }))
      return res.status(400).json({ msg: "No handphone sudah terdaftar" });

    newUser = {
      name,
      username: username.toLowerCase(),
      phone_number,
      password: hashedPassword,
    };
  }
  // validasi jika menggunakan email
  else {
    email = accountSystem;
    if (!validator.isEmail(email))
      return res.status(400).json({ msg: "Email harus valid" });
    if (await Users.findOne({ email }))
      return res.status(400).json({ msg: "Email sudah terdaftar" });

    newUser = {
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    };
  }

  try {
    await Users.create(newUser);
    res.json({ msg: "Register berhasil" });
  } catch (error) {
    console.log(error);
  }
};

// FUNCTION LOGIN
export const Login = async (req, res) => {
  try {
    const { accountSystem, password } = req.body;

    // pengecekan form yang diisi oleh pengguna apakah no.handphone, email, atau username
    const isInputNumeric = validator.isNumeric(accountSystem);
    let user = {};

    if (isInputNumeric) {
      user = await Users.findOne({ phone_number: accountSystem });
      if (!user) return res.status(400).json({ msg: "Akun tidak ditemukan" });
    } else {
      user = await Users.findOne({ email: accountSystem.toLowerCase() });
      if (!user) {
        user = await Users.findOne({ username: accountSystem.toLowerCase() });
        if (!user) return res.status(400).json({ msg: "Akun tidak ditemukan" });
      }
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: `Password salah` });

    const tokenData = { id: user.id, username: user.username };

    // buat accesToken
    const accessToken = jwt.sign(tokenData, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "20s",
    });

    // buat refreshToken
    const refreshToken = jwt.sign(tokenData, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: "1d",
    });

    // mengupdate user refreshToken
    await Users.updateOne({ _id: user.id }, { refresh_token: refreshToken });

    // meresponse cookie refreshToken
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true,
    });

    // meresponse client accesToken
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
  }
};

// FUNCTION LOGOUT
export const Logout = async (req, res) => {
  // ambil refreshToken dari cookie
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  // ambil data user berdasarkan refreshToken dan update refreshTokennya
  const user = await Users.findOne({ refresh_token: refreshToken });
  if (!user) return res.sendStatus(204);

  await Users.updateOne({ _id: user.id }, { refresh_token: null });
  // hapus cookie
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
