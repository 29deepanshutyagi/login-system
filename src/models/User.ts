import mongoose, { Schema, Document, HookNextFunction, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User Document
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    comparePassword(password: string): Promise<boolean>;
}

// Interface for User Model
export interface IUserModel extends Model<IUser> {
    emailExists(email: string): Promise<IUser>;
}

// Schema Definition
const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Pre Hook to Check if Email Exists
userSchema.pre<IUser>('save', async function (next: HookNextFunction) {
    if (!this.isModified('email')) {
        return next();
    }
    const emailExists = await this.collection.findOne({ email: this.email });
    if (emailExists) {
        const error = new mongoose.Error('Email already exists!');
        (error as any).statusCode = 400; // Extend Mongoose error for custom status
        return next(error);
    }
    next();
});

// Pre Hook to Hash Password
userSchema.pre<IUser>('save', async function (next: HookNextFunction) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Document Method to Compare Password
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    const isCorrect = await bcrypt.compare(password, this.password);
    if (!isCorrect) {
        const error = new mongoose.Error('Password is not correct!');
        (error as any).statusCode = 400;
        throw error;
    }
    return isCorrect;
};

// Model Method to Check if Email Exists
userSchema.statics.emailExists = async function (email: string): Promise<IUser> {
    const user = await this.findOne({ email });
    if (!user) {
        const error = new mongoose.Error('User not found!');
        (error as any).statusCode = 404;
        throw error;
    }
    return user;
};

// Export the Model
export const User = mongoose.model<IUser, IUserModel>('User', userSchema);
