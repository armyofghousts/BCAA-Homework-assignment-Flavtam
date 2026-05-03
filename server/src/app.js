const express = require("express");
const categoryController = require("./controllers/categoryController");
const placeController = require("./controllers/placeController");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("FlavTam backend běží");
});

app.post("/category/create", categoryController.create);
app.get("/category/list", categoryController.list);
app.get("/category/get/:id", categoryController.get);
app.post("/category/update", categoryController.update);
app.post("/category/delete", categoryController.remove);

app.post("/place/create", placeController.create);
app.get("/place/list", placeController.list);
app.get("/place/get/:id", placeController.get);
app.post("/place/update", placeController.update);
app.post("/place/delete", placeController.remove);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || 500;
  const payload = { message: err.message || "Internal server error." };

  if (err.details) {
    payload.details = err.details;
  }

  return res.status(status).json(payload);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
