import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name :{
        type :String,
        required : true,
        unique:false
    },
    description :{
        type : String,
        required :false,
    },
    brand :{
        type : String,
        required: false
    },
    price :{
        type : Number,
        required : false,
    },
    image :{
        type:String,
        required :true,
    },
    category :{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Category',
    },
    stock :{
        type : Number,
        required :true,
    },
    color :{
        type :String,
        required : false,
    },
    NewArrival:{
        type:Boolean,
        require:true,
        // default :false
    },
    TopProduct:{
        type:Boolean,
        require:true,
    }
},{
    timestamps :true
});

const Product = mongoose.models.Product || mongoose.model('Product',ProductSchema)

// ✅ Use ESModule export
export default Product;