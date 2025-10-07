import { eq } from "drizzle-orm"
import { db } from "../config/database.js"
import logger from "../config/logger.js"
import bcrypt from 'bcrypt'
import { users } from "#models/user.model.js"

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10)
    } catch (error) {
        logger.error('Error in hashPassword', error)
        throw new Error('Error hashing password')
    }
}

export const createUser = async ({name, email, password, role = 'user'}) => {
    try {
        const existingUser = db.select().from('users').where(eq(users.email, email)).limit(1)

        if (existingUser.length > 0) {
            throw new Error('User with this email already exists')
        }

        const hashedPassword = await hashPassword(password)

        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role
        }).returning({id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt})

        logger.info(`User created successfully: ${email}`)

        return newUser

    } catch (error) {
        logger.error('Error in createUser', error)
        throw new Error('Error creating user')
    }
}