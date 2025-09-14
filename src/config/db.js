import mongoose from "mongoose";

const connectDB = async () => {
  const mongodbURl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@recipecluster.6dhwohq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=RecipeCluster`;

  await mongoose
    .connect(mongodbURl)
    .then(() => {
      console.log("Connected successfully to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    });

  //   const db = mongoose.connect(mongodbURl);
  //   db.on("error", console.error.bind(console, "connection error:"));
  //   db.once("open", function () {
  //     console.log("Connected successfully to MongoDB");
  //   });
};
export default connectDB;
