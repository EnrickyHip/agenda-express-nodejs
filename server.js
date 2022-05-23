require("dotenv").config();
const express = require("express");
const path = require("path");
const routes = require("./routes");
const mongoose = require("mongoose");

//const helmet = require("helmet");
//const csrf = require("csurf");

const app = express();

//const { checkCsrfError, csrfMiddleware } = require("./src/middlewares/csrfMiddlewares");

mongoose
  .connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.emit("ready"))
  .catch(() => console.log("houve um erro na conexão do banco de dados"));

const session = require("express-session");
const MongoStore = require("connect-mongo"); //MongoStore guarda as sessões no banco de dados
const flash = require("connect-flash");

const sessionOptions = session({
  secret: "segredinho hihi",
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 3600 * 24 * 7, //7 dias
    httpOnly: true,
  },
});

//app.use(helmet()); //é recomendado desativar para desenvolvimento.
app.use(flash()); //mensagens para o usuário
app.use(sessionOptions);

app.use(express.urlencoded({ extended: true })); // nos permite postar forms pra dentro do site
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));

//app.use(csrf()); CSRF evita a postagem de formulários vindos de fora do próprio site. é recomendado que seja desativado durante o desenvolvimento.

//middlewares do CSRF, serão executados toda vez que uma nova rota é requerida. Caso o formulário venha de fora do site, o middleware checkCsrfError irá mostrar um erro, para evitar isso em formulários do site basta adicionar ao formulário: <input type="hidden" name="_csrf" value="<%= csrfToken %>">

//app.use(checkCsrfError);
//app.use(csrfMiddleware);
app.use(routes);

app.set("views", path.resolve(__dirname, "src", "views")); //define a pasta das views
app.set("view engine", "ejs"); //define a engine utilizada

app.on("ready", () => {
  app.listen(3000, () => {
    console.log("starting server at: http://localhost:3000");
  });
});
