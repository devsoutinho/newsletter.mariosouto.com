import chalk from "chalk";
import path from "path";
import fs from "fs";
import sgMail from "@sendgrid/mail";
import mjml2html from "mjml";
import { mailingStrategy } from "./mailingStrategy.js";
import dotEnv from "dotenv";

dotEnv.config();

const log = console.log;

log(`${chalk.bgRed("[Email Builder] DevSoutinho 🔥")}`);
log('\n');

const PACKAGE_ROOT = path.resolve(".");
const EMAILS_ROOT = path.resolve(PACKAGE_ROOT, "_data", "emails");
const allEmails = fs.readdirSync(EMAILS_ROOT);

allEmails.map(async (emailFolderName) => {
    const METADATA_PATH = path.resolve(EMAILS_ROOT, emailFolderName, "metadata.json");
    const TEMPLATE_PATH = path.resolve(EMAILS_ROOT, emailFolderName, "template.mjml");
    const templateMJML = fs.readFileSync(TEMPLATE_PATH, "utf8");
    const baseMetadata = JSON.parse(fs.readFileSync(METADATA_PATH, "utf-8"));
    const emailMetadata = {
        templateId: emailFolderName,
        ...baseMetadata,
        mailingList: await mailingStrategy[baseMetadata.mailing]() || [],
        body: mjml2html(templateMJML).html,
    };
    
    if(emailMetadata.sent) {
        log("Email already sent: ", chalk.bgYellow(emailMetadata.templateId));
        return false;
    }

    // IF ANTES DA DATA CORRETA, NÃO ENVIA O EMAIl
    // - Estude sobre datas, e estude sobre GTM-3

    for await (const currentLead of emailMetadata.mailingList) {
        log("Email being sent: ", chalk.bgGreen(emailMetadata.templateId));
        const msg = {
            to: currentLead.email,
            from: emailMetadata.from,
            subject: emailMetadata.subject,
            text: emailMetadata.text,
            html: emailMetadata.body,
        }
        sgMail.setApiKey(process.env.SENDGRID_KEY);
        await sgMail.send(msg);
    }

    fs.writeFileSync(METADATA_PATH, JSON.stringify({
        ...baseMetadata,
        sent: true,
    }, null, 2));
    log(chalk.bgGreen(`Email sent with success to the mailing list (${emailMetadata.mailing})!`));
});

for await (const email of allEmails) {}