import mongoose, {
    Schema,
    model
} from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String
});

productSchema.plugin(mongoosePaginate)

export const ProductModel = model("products", productSchema);