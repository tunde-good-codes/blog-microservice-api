import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    avatar: {
        type: String, // Store image URL or file path
        default: null
    },
    following: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }]
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});
// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });
export default mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map