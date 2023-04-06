const express = require("express");
const { formatRupiah } = require("./helper/helper");
const { path } = require("path");
const session = require("express-session");
const router = require("./routes");
const app = express();
const port = 3000;

app.use(express.static("public"));

// Gunakan middleware express-session
app.use(
  session({
    secret: "rahasia",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: new Date(Date.now() + 3600000) }, // 1 jam (dalam milidetik)
  })
);
// Helper
app.locals.formatRupiah = formatRupiah;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
