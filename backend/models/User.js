// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 500
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false // don't return password by default
    }
}, {
    timestamps: true
});

// Hide password when converting to JSON / Object
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});
userSchema.set('toObject', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

// Pre-save hook for hashing password - FIXED VERSION
userSchema.pre('save', async function (next) {
    // Only hash if the password field was modified (or new)
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    // Remove the next() call or handle it properly
    // return next();
    // OR just let the async function complete
});

// Alternative fix: Remove next parameter entirely
// userSchema.pre('save', async function () {
//     // Only hash if the password field was modified (or new)
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 12);
//     }
// });

// Or if you want to keep next for error handling:
// userSchema.pre('save', async function (next) {
//     try {
//         if (this.isModified('password')) {
//             this.password = await bcrypt.hash(this.password, 12);
//         }
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// Compare candidate password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    // In case password wasn't selected, fetch it
    if (!this.password) {
        const doc = await this.constructor.findById(this._id).select('+password');
        if (!doc) return false;
        return await bcrypt.compare(candidatePassword, doc.password);
    }
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);