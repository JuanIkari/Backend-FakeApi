const express = require("express");
const { createClient } = require("@libsql/client");
const bodyParser = require("body-parser");
const cors = require("cors");

const client = createClient({
  url: "libsql://fake-api-juanikari.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTY2MDY3ODgsImlkIjoiZWZlNGU2YjMtNmNhNi00MWZkLTgwMjQtNTU0NGZkMWVhYWYzIn0.VFhy96E_8ndDvIP13qi9H9TntugXkYNjsH2sydBzVJLVbwxa-W3iG-qA6qkNKLu4jKAlSMLCJcSpyw08gSD0BQ",
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/products", async (req, res) => {
  const products = await client.execute("SELECT * FROM products");
  res.json({ results: products.rows });
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await client.execute(
    `SELECT * FROM products WHERE id = ${id}`
  );
  res.json({ results: product.rows });
});

app.post("/products", async (req, res) => {
  const { title, price, description, category, images } = req.body;

  const products = await client.execute(`
    INSERT INTO products (title, price, description, category, images) VALUES ("${title}", "${price}", "${description}", "${category}", "${images}");`);
  res.json({ message: "Product created" });
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price, description, category, images } = req.body;

  await client.execute(`
      UPDATE products 
      SET title = "${title}", price = "${price}", description = "${description}", category = "${category}", images = "${images}"
      WHERE id = ${id}
      `);

  res.json({ message: "Product updated" });
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await client.execute(`DELETE FROM products WHERE id = ${id}`);
  res.json({ message: "Product deleted" });
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
