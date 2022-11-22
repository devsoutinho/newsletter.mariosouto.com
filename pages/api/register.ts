import { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "../../src/infra/dbClient/dbClient";
import sgMail from "@sendgrid/mail";

// const { data, error } = await dbClient()
//     .from("newsletter")
//     .select("*");

interface NewsletterUser {
    email: string;
    name?: string;
}
export default async function handle(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const responseBody = JSON.parse(request.body) as NewsletterUser;
    // Salvar a pessoa no supabase
    const { data, error } = await dbClient()
        .from("newsletter")
        .insert({
            // IMPORTANTE: Normalizar o input do usuario
            email: responseBody.email,
        });

    console.log("data", data);
    console.log("error", error);

    if (!data && !error) {
        // Enviar um email pra pessoa depois de salvo no sendgrid
        sgMail.setApiKey(process.env.SENDGRID_KEY);
        try {
            await sgMail.send({
                to: 'contato@mariosouto.com',
                from: 'devsoutinho@mariosouto.com', // Use the email address or domain you verified above
                subject: 'Esse email foi enviado a partir da nossa querida live!',
                text: 'Esse texto é só um texto genérico de corpo de email, que vai aparecer em algum lugar, não sei ao certo onde!',
                html: '<strong>Essa parte do texto, vai em negrito e vamos ver se funciona!</strong>',
            });
            response.status(200).json({ message: "Usuário cadastrado com sucesso!" });
        } catch (err) {
            response.status(400).json({ message: "Usuário cadastrado mas falha ao enviar email de confirmação" });
        }
        // ===============
    } else {
        response.status(500).json({ message: "Erro desconhecido do servidor" });
    }



}