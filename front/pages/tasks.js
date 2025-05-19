'use client'; 
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; 
import { useAuthStore } from '@/store/auth';
export default function Tasks() {
  const {user} = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [titulo	, setTitulo] = useState("");
  const [estado,setEstado] = useState(1);
  const [descripcion, setDescripcion] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
 
  
  const fetchTasks = async () => {
 
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    try {
      const res = await fetch(`http://localhost:8787/api/tasks/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
   
    const {tasks}=data;
      if (Array.isArray(tasks)) {
        setTasks(tasks);
      } else {
        setTasks([]);
        setError("No hay tareas");
      }
    } catch (err){
     
      setError("Error de conexión");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && user.id) {
      fetchTasks();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    try {
      const url = editing ? `http://localhost:8787/api/task/${editing.id}` : "http://localhost:8787/api/task";
      const method = editing ? "PUT" : "POST";     
      const data_stream={titulo,descripcion,"user_id":user.id,estado};     
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data_stream),
      });
    
      if (res.ok) {
        setTitulo("");
        setDescripcion("");
        setEditing(null);
        fetchTasks();
      } else {
        setError("Error al guardar la tarea");
      }
    } catch {
      setError("Error de conexión");
    }
  };

  const handleEdit = (task) => {
    setEditing(task);
    setTitulo(task.titulo	);
    setDescripcion(task.descripcion);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    if (!window.confirm("¿Eliminar esta tarea?")) return;
    try {
      const res = await fetch(`http://localhost:8787/api/task/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchTasks();
      else setError("Error al eliminar la tarea");
    } catch(err)  {
      console.log("🚀 ~ handleDelete ~ err:", err)
      setError("Error de conexión");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-600">  Tareas {user?.name ?? '...'} </h2>
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-2">
            <input
              type="text"
              className="w-full border px-3 py-2 rounded text-gray-800"
              placeholder="Título"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <textarea
              className="w-full border px-3 py-2 rounded text-gray-800"
              placeholder="Descripción"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            {editing ? "Actualizar" : "Crear"} tarea
          </button>
          {editing && (
            <button
              type="button"
              className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              onClick={() => {
                setEditing(null);
                setTitulo("");
                setDescripcion("");
              }}
            >
              Cancelar
            </button>
          )}
        </form>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {loading ? (
          <div>Cargando...</div>
        ) : (
          <ul>
            {tasks.length === 0 && <li>No hay tareas.</li>}
            {(tasks)&& 
             tasks.map(task => (
              <li key={task.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <strong className="text-gray-800">{task.titulo}</strong>
                  <p className="text-sm text-gray-800">{task.descripcion}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(task)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Editar</button>
                  <button onClick={() => handleDelete(task.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Eliminar</button>
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