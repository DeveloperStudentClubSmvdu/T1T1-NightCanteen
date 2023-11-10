import {Schema , model } from "mongoose";

const itemSchema = new Schema({
    
    title : {
        type : String,
        require : [true , "Dish/Food Name is required"],
        minLen  : 4
    },

    description : {
        type : String,
        required : [true , "Description is required"],
        minLength : [8 , "Description must be at least 10 characters"],
    },

    price : {
        type : Number,
        require : [true , "Price is required"]
    },

    availability : {
        type : Boolean,
        required : true
    },

    category : {
        type : String,
        required : [true , "Category is required"]
    },

    img : {
        public_id : {
            type : String
        },
        secure_url : {
            type : String
        }
    }

}, {
    timestamps : true
});

const Items = model('Items' , itemSchema);

export default Items;