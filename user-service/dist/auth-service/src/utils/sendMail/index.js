import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
dotenv.config();
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const renderEmailTemplate = async (templateName, data) => {
    const templatePath = path.join(process.cwd(), "apps", "auth-service", "src", "utils", "emil-templates", `${templateName}.ejs`);
    return ejs.renderFile(templatePath, data);
};
export const sendEmail = async (to, subject, templateName, data) => {
    try {
        const html = await renderEmailTemplate(templateName, data);
        await transporter.sendMail({
            from: `${process.env.SMTP_USER}`,
            to,
            subject,
            html,
        });
        return true;
    }
    catch (e) {
        console.log("error sending mail: " + e);
        return false;
    }
};
//# sourceMappingURL=index.js.map