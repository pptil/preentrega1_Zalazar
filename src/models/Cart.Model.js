import mongoose, {
    Schema,
    model
} from "mongoose";

const cartSchema = new Schema({
    products: {
        default: [],
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: {
                type: Number,
                default: 0
            }
        }]
    }
})

export const CartModel = model("carts", cartSchema);