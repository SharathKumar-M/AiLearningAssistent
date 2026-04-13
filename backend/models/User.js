import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    ussername: {
        type: String,
        required: [true, 'Please provide a username'],
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        unique: true
    },

    email: {
        type: String,
        required: [true, 'Please provide an email'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email' ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters']
    },

    profileImage: {
        type: String,
        default: null
    }
    }, {
        timestamps: true
    });


    userSchema.pre('save', async function (next) {

        if(!this.isModified('password')) {
            next();
        }

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
     
    });

    userSchema.methods.matchPassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    };

    const User = mongoose.model('User', userSchema);
    
    export default User;

