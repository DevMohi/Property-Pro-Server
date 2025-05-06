import mongoose from "mongoose";
import app from "./app";

async function server() {
  //changed over here the uri to test the project
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);

    app.listen(5000, () => {
      console.log(`PropertyPro is up and running`);
    });
  } catch (error) {
    console.error(error);
  }
}

server();
