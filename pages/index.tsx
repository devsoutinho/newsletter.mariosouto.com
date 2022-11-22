import React from "react";

export default function HomeScreen() {
    const [values, setValues] = React.useState({ email: 'devsoutinho@mariosouto.com' });

    return (
        <div>
            <style jsx>{`
                * {
                    font-family: sans-serif;
                }
            `}</style>

            <h1>Registre-se na newsletter!</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log(values);
                    fetch("/api/register", {
                        method: "POST",
                        body: JSON.stringify(values),
                    })
                    .then(async (initialResponseFromServer) => {
                        const response = await initialResponseFromServer.json();
                        console.log('Resposta do server: ', response);
                    });
                }}
            >
                <label htmlFor="newsletter-optin">
                    Cadastrar na Newsletter
                </label>
                <div>
                    <input
                        id="newsletter-optin"
                        name="email"
                        value={values.email}
                        onChange={(e) => setValues((values) => {
                            return {...values, email: e.target.value}
                        })}
                    />
                </div>
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    )
}