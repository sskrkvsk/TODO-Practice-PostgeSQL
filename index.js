import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// DB Connection
const db = new pg.Pool({
user: "postgres",
host: "localhost",
database: "permalist",
password: "4766",
port: 5432,
});
db.connect();
//

app.get("/", async (req, res) => {
  // Display all of the items from the DB
  const result = await db.query("SELECT * FROM items ORDER BY id");
  let items = result.rows;

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const result = await db.query("INSERT INTO items (title) VALUES ($1) RETURNING *", [item]);
  // console.log(result.rows);

  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const itemId = req.body.updatedItemId;
  const newValue = req.body.updatedItemTitle;

  const result = await db.query("UPDATE items SET title = $1 WHERE id = $2 RETURNING *", [newValue, itemId]);
  // console.log(result.rows);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const deleteId = req.body.deleteItemId;

  const result = await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [deleteId]);
  // console.log(result.rows);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
