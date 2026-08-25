import {z} from "zod";

export const createUserSchema = z.object({
    username: z.string().email(),
    password: z.string(),
    name: z.string().optional(),
    photo: z.string().optional()
});

export const signinSchema = z.object({
    username : z.string(),
    password : z.string()
})

export const createRoomSchema = z.object({
    slug : z.string().min(3)
})