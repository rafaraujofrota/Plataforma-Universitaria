import { readFileSync } from "fs";
import mailer from "../../config/mail";
import path from "path";

interface SendVerification {
    to: string;
    code: string;
}

function getEmailPath(template: string) {
    return path.resolve(__dirname, "..", "..", "..", "view", template)
}

export async function sendVerificationEmail({ to, code }: SendVerification) {
    const templatePath = getEmailPath("emailVerify.html")
    let html = readFileSync(templatePath, "utf-8");

    // Aparentemente o Gmail remove links suspeitos, então localhost:3333 não funciona 
    // Não vai funcionar para testes locais, só vai quando colocarmos em um VPS
    html = html.replace("{{code}}", `${process.env.API_URL}/users/verify/${code}`);

    const message = {
        from: `"Chama!" <${process.env.MAIL_ADRESS}>`,
        to,
        subject: "Verifique sua conta",
        html
    };

    await mailer.sendMail(message);
}