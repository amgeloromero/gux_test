import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetch("http://localhost:8787/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          setUser(data);
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4  text-gray-600">Bienvenido, {user?.name}</h1>
        <p className="mb-6 text-gray-600">Rol {user?.role}</p>
        <p className="mb-6  text-gray-600">Has iniciado sesión correctamente.</p>
        <div className="flex flex-col gap-4">
          <a href="/tasks" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Gestionar Tareas</a>
          {(user?.role === "admin") &&
          <a href="/users" className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Gestionar Usuarios</a> }
          <button onClick={handleLogout} className="bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}