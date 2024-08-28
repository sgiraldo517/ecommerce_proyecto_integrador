import mongoose from "mongoose";

const userCollection = "User"
const userSchema = new mongoose.Schema({
        first_name: String,
        last_name: String,
        email: { type: String, unique: true },
        age: Number,
        password: String,
        carts: {
            type: [
                {
                    cart:{
                        type: mongoose.Schema.ObjectId,
                        ref:"Carts"
                    }
                }
            ],
            default: []
        },
        role: { type: String, default: "user" }
    }
)

const userModel = mongoose.model(userCollection, userSchema)


export default userModel