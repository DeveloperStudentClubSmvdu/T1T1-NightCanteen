import { Schema , model } from 'mongoose';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        minLength: [3, 'Username must be at-least 5 character'],
        maxLength: [50, 'Username must be less than 50 characters'],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill in a valid email address',
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at-least 8 characters'],
        select: false
    },
    roles: {
        type: String,
        enum: ['CUSTOMER', 'ADMIN'],
        default: 'CUSTOMER'
    },

    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    
}, {
    timestamps: true
});



userSchema.pre('save', async function(next) {
    
    if(!this.isModified('password')){
        return next();
    }
    
    this.password = await bcrypt.hash(this.password , 10);
    return next();
})

userSchema.methods = {
    jwtToken() {
        return JWT.sign(
            {id : this._id ,roles: this.roles, email: this.email},
            process.env.JWT_SECRET,
            {expiresIn : process.env.JWT_EXPIRY}
        )
    },

    comparePassword: async function (plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    },

    generatePasswordToken : async function(){
        const resetToken = crypto.randomBytes(20).toString('hex');

        this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000 // 15 min

        return resetToken;
    }
}

const User = model('User', userSchema);

export default User;