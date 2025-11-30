import { Secret, SignOptions } from "jsonwebtoken";

interface AuthConfig {
    jwt: {
        secret: Secret;
        expiresIn: SignOptions["expiresIn"]
    }
}

const authConfig: AuthConfig = {
    jwt: {
        secret: process.env.APP_SECRET || "default",
        expiresIn: "60d"
    }
}

export default authConfig