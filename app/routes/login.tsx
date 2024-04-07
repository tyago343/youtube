import { ActionFunctionArgs, redirect } from "@remix-run/node";
import Icon from "../components/atoms/Icon";
import { Form } from "@remix-run/react";
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const user = await response.json();
      return redirect("/", {
        headers: {
          "Set-Cookie": `user=${JSON.stringify(user)}; HttpOnly;
            Path=/`,
        },
      });
    }
  } catch (e) {
    throw new Error();
  }
}
export default function Login() {
  return (
    <div className="bg-slate-100 w-screen h-screen flex flex-col justify-center ">
      <Form
        className="bg-white container mx-auto min-h-[540px] max-w-md rounded-lg p-6 relative text-gray-800"
        method="POST"
      >
        <Icon />
        <h1 className="text-lg my-4">Inicia sesión</h1>
        <p className="mb-4">Acceder a Youtube</p>
        <div className="flex flex-col gap-y-2 mb-4">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            name="email"
            className="border h-10 border-gray-400 rounded-md px-2 py-1"
            placeholder="Correo electrónico"
            defaultValue="test@testpiola.com"
          />
        </div>
        <div className="flex flex-col gap-y-2 mb-4">
          <label htmlFor="password">Passwoord</label>
          <input
            type="password"
            name="password"
            className="border h-10 border-gray-400 rounded-md px-2 py-1"
            placeholder="Password"
            defaultValue="123123123"
          />
        </div>
        <div className="absolute bottom-0 container px-8 py-6  flex justify-between left-0">
          <button className="text-blue-500 font-semibold rounded-lg px-3 py-2 hover:bg-blue-50 -ml-4">
            Crear cuenta
          </button>
          <button
            type="submit"
            className="text-white bg-blue-700 rounded-lg px-6 py-2 hover:bg-blue-900 hover:shadow-md"
          >
            Envíar
          </button>
        </div>
      </Form>
    </div>
  );
}
