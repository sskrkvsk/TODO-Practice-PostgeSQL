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

// let items = [
//   // { id: 1, title: "Buy milk" },
//   // { id: 2, title: "Finish homework" },
// ];

app.get("/", async (req, res) => {
  // Display all of the items from the DB
  const result = await db.query("SELECT * FROM items");
  let items = result.rows;

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  
  const result = await db.query("INSERT INTO items (title) VALUES ($1) RETURNING *", [item]);
  console.log(result.rows);

  res.redirect("/");
});

app.post("/edit", (req, res) => {});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
