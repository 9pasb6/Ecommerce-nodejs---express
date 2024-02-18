import mongoose from "mongoose";

const connectDB = async () =>{

    try {

        const connection = await mongoose.connect(process.env.MONGO_URI)

        const url = `${connection.connection.host}:${connection.connection.port}`

        console.log(`MongoDB conectado en: ${url}`)
        
    } catch (error) {
        console.log(`Error connection: ${error.message}`)
        process.exit(1); // para forazar el proceso de coneción con mongo
    }
}

export default connectDB