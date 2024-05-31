import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createServer } from 'node:http';
import * as database from "./database.js";
import CryptoJS from 'crypto-js';
import bodyParser from 'body-parser';

const app = express();
const server = createServer(app);

const port = process.env.PORT || 4000;

// Configuración inicial
app.set("port", port);

// Middlewares
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:4321', 'http://localhost:4322'];
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite solicitudes desde cualquier origen
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Encabezados permitidos
    next();
});

app.post("/login/auth", async (req, res) => {
  const connection = await database.getConnection();

  const { email, password } = req.body;

  const user = await connection.query("SELECT * FROM users WHERE email = ?", [email]);

  if (user.length === 0) {
      return res.status(400).json({
          message: "Usuario no encontrado"
      });
  }

  const decryptedPassword = decrypt(user[0].password);

  if (decryptedPassword !== password) {
      return res.status(400).json({
          message: "Contraseña incorrecta"
      });
  }

  return res.status(200).json({
      message: "Inicio de sesión exitoso",
      id: user[0].id_user
  });
})

app.post("/register/auth", async (req, res) => {
  const connection = await database.getConnection();

  const { username, email, password } = req.body;

  const user = await connection.query("SELECT * FROM users WHERE email = ?", [email]);

  if (user.length > 0) {
      return res.status(400).json({
          message: "Correo electronico ya existe"
      });
  }

  const encryptedPassword = encrypt(password);

  let id_user = await generateIdUser(connection);
  
  const query = await connection.query("INSERT INTO users (id_user, username, email, password) VALUES (?, ?, ?, ?)", [id_user, username, email, encryptedPassword]);

  if (!query) {
      return res.status(400).json({
          message: "Error al registrar usuario"
      });
  }

  return res.status(200).json({
      message: "Usuario registrado con éxito"
  });
});

app.post("/products/create", async (req, res) => {
  const connection = await database.getConnection();

  const { name, brand, category, description, price, weight, length, breadth, width, dropzone_image, images, id_user } = req.body;

  let product_id = await generateId(connection);

  const priceRating = calculatePriceRating(price);
  const weightRating = calculateWeightRating(weight);
  const dimensionRating = calculateDimensionRating(length, breadth, width);

  const rating = (priceRating + weightRating + dimensionRating) / 3;

  let sales_day = price > 0 ? price / 1000 : 0;
  let sales_month = sales_day * 30;
  let sales = sales_day * 7;
  let revenue = sales * price;

  let stock = 100; 
  if (price > 20000) stock -= 10;
  else if (price > 15000) stock -= 5;
  else if (price > 10000) stock -= 2.5;

  const totalDimension = length + breadth + width;
  if (totalDimension > 200) stock -= 10;
  else if (totalDimension > 150) stock -= 5;
  else if (totalDimension > 100) stock -= 2.5;

  if (stock < 0) stock = 0; 

  let query = await connection.query(
      "INSERT INTO products (id_product, id_user, name, brand, category, description, price, item_weight, length, breadth, width, rating, sales_day, sales_month, sales, revenue, stock, image, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [product_id, id_user, name, brand, category, description, Number(price), Number(weight), Number(length), Number(breadth), Number(width), rating.toFixed(1), sales_day.toFixed(1), sales_month.toFixed(1), sales, revenue, stock.toFixed(1), images[0] || "", JSON.stringify(images) || ""]
  );

  if (!query) {
      return res.status(400).json({
          message: "Error al crear producto"
      });
  }

  return res.status(200).json({
      message: "Producto creado con éxito"
  });
});

app.post("/products/search", async (req, res) => {
  const connection = await database.getConnection();
  const { id_user, name } = req.body;
  const query = await connection.query("SELECT * FROM products WHERE name LIKE ? AND id_user = ?", [`%${name}%`, id_user]);
  res.json(query);
})

app.delete("/products/delete", async (req, res) => {
  const connection = await database.getConnection();

  const { id_product } = req.body;

  if (Array.isArray(id_product)) {
    for (const id of id_product) {
      const query = await connection.query("DELETE FROM products WHERE id_product = ?", [id]);

      if (!query) {
        return res.status(400).json({
          message: `Error al eliminar el producto con id ${id}`
        });
      }
    }
  } else {
    const query = await connection.query("DELETE FROM products WHERE id_product = ?", [id_product]);

    if (!query) {
      return res.status(400).json({
        message: `Error al eliminar el producto con id ${id_product}`
      });
    }
  }

  return res.status(200).json({
    message: "Productos eliminados con éxito"
  });
});

app.put("/products/edit", async (req, res) => {
  const connection = await database.getConnection();

  const { id_product, name_product, brand_product, category_product, description_product, weight_product, length_product, breadth_product, width_product, images} = req.body;

  const query = await connection.query("UPDATE products SET name = ?, brand = ?, category = ?, description = ?, item_weight = ?, length = ?, breadth = ?, width = ?, images = ? WHERE id_product = ?", [name_product, brand_product, category_product, description_product, weight_product, length_product, breadth_product, width_product, JSON.stringify(images), id_product]);

  if (!query) {
      return res.status(400).json({
          message: "Error al editar producto"
      });
  }

  return res.status(200).json({
      message: "Producto editado con éxito"
  });
})

app.get("/products", async (req, res) => {
  const connection = await database.getConnection();

  const { id_user } = req.query;

  const products = await connection.query("SELECT * FROM products WHERE id_user = ?", [id_user]);

  res.json(products);
})

app.get("/products/product", async (req, res) => {
  const connection = await database.getConnection();

  const { id_product } = req.query;

  const product = await connection.query("SELECT * FROM products WHERE id_product = ?", [id_product]);

  res.json(product);
})

app.get("/users/data", async (req, res) => {
  const connection = await database.getConnection();

  const { id_user } = req.query;

  const user = await connection.query("SELECT * FROM users WHERE id_user = ?", [id_user]);

  res.json(user);
})

server.listen(app.get("port"));
console.log("Escuchando el puerto " + app.get("port"));

async function generateId(connection){
  let id_product = Math.floor(Math.random() * 900000000) + 100000000;
  let exist_id_product = await connection.query("SELECT * FROM products WHERE id_product = ?", [id_product]);
  let max_attemps_id_destino = 100;
  while(exist_id_product.length > 0 && max_attemps_id_destino > 0){
      id_product = Math.floor(Math.random() * 900000000) + 100000000;
      exist_id_product = await connection.query("SELECT * FROM products WHERE id_product = ?", [id_product]);
      max_attemps_id_destino --;
  }

  if(max_attemps_id_destino == 0){
      return null;
  }else{
      return id_product;
  }
}

async function generateIdUser(connection){
  let id_user = Math.floor(Math.random() * 900000000) + 100000000;
  let exist_id_user = await connection.query("SELECT * FROM users WHERE id_user = ?", [id_user]);
  let max_attemps_id_destino = 100;
  while(exist_id_user.length > 0 && max_attemps_id_destino > 0){
      id_user = Math.floor(Math.random() * 900000000) + 100000000;
      exist_id_user = await connection.query("SELECT * FROM users WHERE id_user = ?", [id_user]);
      max_attemps_id_destino --;
  }

  if(max_attemps_id_destino == 0){
      return null;
  }else{
      return id_user;
  }
}

function calculatePriceRating(price) {
    if (price <= 5000) return 1;
    else if (price <= 10000) return 2;
    else if (price <= 15000) return 3;
    else if (price <= 20000) return 4;
    else return 5;
}

function calculateWeightRating(weight) {
    if (weight <= 5) return 1;
    else if (weight <= 10) return 2;
    else if (weight <= 15) return 3;
    else if (weight <= 20) return 4;
    else return 5;
}

function calculateDimensionRating(length, breadth, width) {
    const totalDimension = length + breadth + width;
    if (totalDimension <= 50) return 1;
    else if (totalDimension <= 100) return 2;
    else if (totalDimension <= 150) return 3;
    else if (totalDimension <= 200) return 4;
    else return 5;
}

function encrypt(value){
  value = CryptoJS.AES.encrypt(value, 'clave_secreta').toString();
  return value;
}

function decrypt(value){
  value = CryptoJS.AES.decrypt(value, 'clave_secreta').toString(CryptoJS.enc.Utf8);
  return value;
}