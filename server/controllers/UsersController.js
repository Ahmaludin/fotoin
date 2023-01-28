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
  const { username, email, password, confPassword } = req.body;

  // validasi username
  const validUsername = validator.matches(username, /^[a-zA-Z0-9_]+$/);
  if (!validUsername)
    return res.status(400).json({
      msg: "Username hanya boleh menggunakan huruf, angka, dan garis bawah",
    });
  // validasi email
  const validEmail = validator.isEmail(email);
  if (!validEmail) return res.status(400).json({ msg: "Email harus valid" });

  // cek email terdaftar
  const existEmail = await Users.findOne({ email });
  if (existEmail) return res.status(400).json({ msg: "Email sudah terdaftar" });
  // cek username terdaftar
  const existUsername = await Users.findOne({ username });
  if (existUsername)
    return res.status(400).json({ msg: "Username tidak tersedia" });

  // cek match password
  if (password !== confPassword)
    return res.status(400).json({ msg: "Password harus sama" });
  // validasi password
  const validPassword = validator.matches(password, /^[a-zA-Z0-9!@#$%]{8,}$/);
  if (!validPassword)
    return res.status(400).json({
      msg: "Password harus terdiri dari minimal 8 karakter huruf besar, huruf kecil, angka, dan simbol (!@#$%)",
    });

  // melakukan hash password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    await Users.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    res.json({ msg: "Register berhasil" });
  } catch (error) {
    console.log(error);
  }
};

// FUNCTION LOGIN
export const Login = async (req, res) => {
  try {
    // pengecekan form yang diisi oleh pengguna apakah no.handphone, email, atau username
    const isPhoneNumber = validator.isMobilePhone(req.body.account, "any");
    const isEmail = validator.isEmail(req.body.account);

    let user = {};
    if (isPhoneNumber) {
      user = await Users.findOne({ phone_number: req.body.account });
      if (!user) return res.status(400).json({ msg: "Akun tidak ditemukan" });
    } else if (isEmail) {
      user = await Users.findOne({ email: req.body.account });
      if (!user) return res.status(400).json({ msg: "Akun tidak ditemukan" });
    } else {
      user = await Users.findOne({ username: req.body.account });
      if (!user) return res.status(400).json({ msg: "Akun tidak ditemukan" });
    }

    // compare password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ msg: `Password salah` });

    const isDataUser = {
      userId: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      bio: user.bio,
      external_link: user.external_link,
      profile_photo: user.profile_photo,
      posts: user.posts,
    };

    // buat accesToken
    const accesToken = jwt.sign(isDataUser, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "20s",
    });

    // buat refreshToken
    const refreshToken = jwt.sign(isDataUser, process.env.JWT_REFRESH_TOKEN, {
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
    res.json({ accesToken });
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
