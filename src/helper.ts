import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export async function comparePassword(password: string, hashedPassword: string) {
    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch;
}

export function generateAccessToken(user: User) {
    const {username} = user
    const payloadUser = {username}
    return "Bearer "+ jwt.sign(payloadUser, process.env.SECRET_KEY as string, { expiresIn: '1d' })
}