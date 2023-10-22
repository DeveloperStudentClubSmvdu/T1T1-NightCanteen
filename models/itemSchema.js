import {Schema , model } from "mongoose";

const itemSchema = new Schema({
    
    name : {
        type : String,
        require : [true , "Dish/Food Name is required"]
    },

    description : {
        type : String,
        required : [true , "Description is required"],
        minLength : [10 , "Description must be at least 10 characters"],
        maxLength : [80 , "Description must be less than 80 characters"]
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

    itemImage : {
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

