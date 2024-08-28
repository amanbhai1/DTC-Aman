import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next(); // Move to next middleware if password is not modified
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

// Create User Model
const User = mongoose.model('User', userSchema);

export default User;
