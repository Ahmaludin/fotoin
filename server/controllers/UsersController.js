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
