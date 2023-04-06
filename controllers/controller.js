const {Category,Product,Transaction,User,Sequelize, sequelize} = require(`../models`);

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "sahawee21208@gmail.com", // ganti dengan email pengirim
    pass: "ddorperlzwysmgzk", // ganti dengan password email pengirim
  },
});
class Controller {
  static home(req, res) {
    let userPromise = null;
    if (req.session.user && req.session.user.id) {
      // ambil data user dari database dengan menggunakan model User
      userPromise = User.findOne({ where: { id: req.session.user.id } });
    }
    let productPromise = null;
    let whereClause = {};
    if (req.query.search) {
      whereClause.productName = {
        [Sequelize.Op.like]: `%${req.query.search}%`,
      };
    }
    // ambil data product dari database dengan menggunakan model Product
    productPromise = Product.findAll({
      where: whereClause,
    });

    let categoryPromise = Category.findAll();

    Promise.all([userPromise, productPromise, categoryPromise])
      .then(([user, products, category]) => {
        res.render("home", {
          user: user,
          products: products,
          category: category,
        });
      })
      .catch( (err) => {
        console.log(err);
        res.send(err);
      });
  }

  static showAllProducts(req, res){
    let search = req.query.search

    if(!search) {
      search=""
    }
    Product.findAll({
      where: {
        productName:{
         [Op.iLike]: `%${search}%`
        }
      },
      include: Category
    })
    .then((products) => {
      console.log(products);
      res.render('allProducts', {products})
    }).catch((err) => {
      res.send(err);
    })
  }

  static adminPage(req,res){
    res.render('adminPage');
  }

  static register(req, res) {
    res.render(`userRegister`);
  }
  static registerPost(req, res) {
    const { email, password, firstName, lastName, dateOfBirth, role } =req.body;

    // Middleware untuk mengecek apakah email dan password sudah terisi
    if (!email || !password) {
      return res.send("Email dan password harus diisi");
    }

    // Hash password menggunakan bcryptjs
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.log(err);
        return res.send("Terjadi kesalahan saat membuat akun");
      }

      // Simpan data user yang baru dibuat ke dalam database
      User.create(
        {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          dateOfBirth,
          role,
        },
        {
          validate: true,
        }
      )
        .then((newUser) => {
          // Set session user dengan id user yang baru saja dibuat
          req.session.user = {
            id: newUser.id,
          };

          // Mengirim email pemberitahuan berhasil registrasi
          const mailOptions = {
            from: "sahawee21208@gmail.com", // ganti dengan email pengirim
            to: email,
            subject: "Registrasi berhasil",
            text: `Selamat ${firstName} ! Anda telah berhasil mendaftar akun di situs kami`,
          };

          transporter.sendMail(mailOptions,(error, info)  => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          // Redirect ke halaman dashboard
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
          res.locals.errors = err.errors;
          res.render("register");
        });
    });
  }


  static login(req, res) {
    res.render("userLogin");
  }

  static loginPost(req, res) {
    const { email, password } = req.body;

    User.findOne({
      where: {
        email: email,
      },
    })
      .then((user) => {
        if (!user) {
          return res.render("userLogin", {
            errors: [{ msg: "User not found" }],
          });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
          return res.render("userLogin", {
            errors: [{ msg: "Invalid password" }],
          });
        }

        req.session.user = user;
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.render("userLogin", { errors: [{ msg: "Something went wrong" }] });
      });
  }


  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  }

  static category(req, res) {
    // ambil data category dengan menggunakan model Category
    Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ["productName", "price", "imageUrl"],
        },
      ],
    })
      .then((category) => {
          res.render("category", { category });
      })
      .catch((err) => {
        console.log(err);
        req.send(err)
      });
  }

  static showAddProduct(req, res) {

    const countries = ['Indonesia', 'Malaysia', 'United States', 'United Kingdom'];

    Category.findAll()
      .then((categories) => {
        res.render("productCreate", { categories, countries });
      })
      .catch((err) => {
        console.log(err);
        res.send(err)
      });
  }

  static addProduct(req, res) {
    const { productName, price, stock, description, country, CategoryId } = req.body;

    // Mengambil file gambar dari request dan menyimpannya ke database
    const imageUrl = `images/${req.file.filename}`;
    console.log(imageUrl);

    // Membuat record product baru
    Product.create({
      productName,
      price,
      stock,
      description,
      imageUrl,
      country,
      CategoryId,
    })
      .then((product) => {
        res.redirect("/allProducts");
      })
      .catch((err) => {
        console.log(err);
        res.send(err)
      });
  }

  static delete (req,res) {
    const {id} = req.params
    console.log(id);
    Product.destroy({
      where :{
        id : id
      }
    })
    .then((_) => {
      res.redirect("/allProducts")
    })
    .catch((err) => {
      console.log(err)
      res.send(err);
    })
  }

  static detailProduct(req, res){
    res.render('productDescription')
  }
}

module.exports = Controller;
