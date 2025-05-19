import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    try {
      const res = await fetch("http://localhost:8787/api/getusers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const { users } = data; 
      if (res.ok) setUsers(users);
      else setError("No se pudieron cargar los usuarios");
    } catch {
      setError("Error de conexión");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
   
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      const res = await fetch(`http://localhost:8787/api/deleteuser/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchUsers();
      else setError("Error al eliminar el usuario");
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-600">Usuarios</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {loading ? (
          <div>Cargando...</div>
        ) : (
          <ul>
            {users.length === 0 && <li>No hay usuarios.</li>}
            {users.map(user => (
              <li key={user.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <strong className="text-gray-600 ">{user.name}</strong>
                  <p className="text-sm text-gray-600 ">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(user.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 text-center">
          <a href="/dashboard" className="text-blue-600 hover:underline">Volver al Dashboard</a>
        </div>
      </div>
    </div>
  );
}