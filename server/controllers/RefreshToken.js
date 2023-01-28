import Users from "../models/UsersModel.js";
import jwt from "jsonwebtoken";

const refreshToken = async (req, res) => {
  try {
    // mengambil refreshToken dari cookies
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    // mengambil 1 user berdasarkan refreshToken
    const user = await Users.findOne({ refresh_token: refreshToken });
    if (!user) return res.sendStatus(403);

    // verifikasi refreshToken, buat ulang dan response accesToken
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, encoded) => {
      if (err) return res.sendStatus(403);

      const tokenData = { id: user.id, username: user.username };

      const accessToken = jwt.sign(tokenData, process.env.JWT_ACCESS_TOKEN, {
        expiresIn: "15s",
      });

      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};

export default refreshToken;
