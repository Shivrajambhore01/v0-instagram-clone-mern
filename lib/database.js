import mongoose from "mongoose"

const MONGODB_URI =
  "mongodb+srv://shivrajambhore01_db_user:HUFdnQc3ePih6hFx@cluster0.b3xyvwm.mongodb.net/instagram_clone?retryWrites=true&w=majority&appName=Cluster0"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB Atlas")
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
