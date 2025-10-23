import { type } from "arktype";

export const loginSchema = type({
    email: "string.email",
    password: "string > 8",
});