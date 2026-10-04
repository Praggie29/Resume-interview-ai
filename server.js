require("dotenv").config();
const app=require("./src/app");
const connectDB=require("./src/config/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
  // 1. Connect DB and load Bloom filter FIRST
  await connectDB();
  // 2. Only start taking user traffic if DB succeeded!
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
startServer();