const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const {
  registerSchema,
  loginSchema,
} = require("../validation/authValidation");


// REGISTER
exports.register = async (req, res) => {
  try {

    // VALIDATION
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { username, fullname, email, password } = req.body;

    // cek email
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({
        message: "Email sudah digunakan",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const { data, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          username,
          fullname,
          email,
          password: hashedPassword,
        },
      ])
      .select();

    if (insertError) throw insertError;

    res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: data[0].id,
        username: data[0].username,
        fullname: data[0].fullname,
        email: data[0].email,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {

    // VALIDATION
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    // cari user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // cek password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Password salah",
      });
    }

    // generate token
    const token = generateToken(user);

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};