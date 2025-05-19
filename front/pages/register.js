import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordconfirmed] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
       const register_user= { name, email, password,password_confirmation,'role':'user'};
      const res = await fetch("http://localhost:8787/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(register_user),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setSuccess("Registro exitoso. Redirigiendo al login...");
        setTimeout(() => router.push("/login"), 1500);
      } else {

     
        setError(data.message || "Error en el registro");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-600">Registro</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Nombre</label>
          <input type="text" className="w-full border px-3 py-2 rounded text-gray-600" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Correo electrónico</label>
          <input type="email" className="w-full border px-3 py-2 rounded text-gray-600" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-gray-600">Contraseña</label>
          <input type="password" className="w-full border px-3 py-2 rounded text-gray-600" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-gray-600">Confimación Contraseña</label>
          <input type="password" className="w-full border px-3 py-2 rounded text-gray-600" value={password_confirmation} onChange={e => setPasswordconfirmed(e.target.value)} required />
        </div>


        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Registrarse</button>
        <p className="mt-4 text-center text-sm text-gray-600">¿Ya tienes cuenta? <a href="/login" className="text-blue-600 hover:underline">Inicia sesión</a></p>
      </form>
    </div>
  );
}