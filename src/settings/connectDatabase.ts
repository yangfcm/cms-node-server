import mongoose from "mongoose";

const connect = async (url: string) => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(url);
    console.log("Database is connected.");
  } catch (err) {
    console.log("Failed to connect DB: ", err.message);
  }
};

export default connect;
