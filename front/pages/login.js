'use client';
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from '@/store/auth';
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const {setUser} = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8787/api/login", {
        method: "POST",
        headers: {
             "Content-Type": "application/json"
             },
        body: JSON.stringify({ email, password }),
      });
      console.log(res);
      console.log(email);
      console.log(password);
      const data = await res.json();

      console.log(data);
      if (res.ok && data.token) {
        const token = data.token;
        const me = await fetch('http://localhost:8787/api/me', {
            headers: { Authorization: `Bearer ${token}` },
          });    
          const user = await me.json();
          console.log("🚀 ~ handleSubmit ~ user:", user.id)
         const {id}=user; 
         console.log("🚀 ~ handleSubmit ~ id:", id)
       
        setUser(user);
       
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Error de autenticación");
      }
    } catch (err) {
      console.log("🚀 ~ handleSubmit ~ err:", err)
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-600">Iniciar sesión</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Correo electrónico</label>
          <input type="email" className="w-full border px-3 py-2 rounded" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-gray-600">Contraseña</label>
          <input type="password" className="w-full border px-3 py-2 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Entrar</button>
        <p className="mt-4 text-center text-sm text-gray-600">¿No tienes cuenta? <a href="/register" className="text-blue-600 hover:underline">Regístrate</a></p>
      </form>
    </div>
  );
}