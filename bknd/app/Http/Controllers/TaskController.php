<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    public function addTask(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 402);
        }

        $task = new Task();
        $task->titulo = $request->titulo;
        $task->descripcion = $request->descripcion;
        $task->estado = $request->estado;
        $task->user_id = $request->user_id;
        $task->save();
    
        return response()->json(['message'=>'Tarea agregada'], 201);
    }


    public function getTasks($id)
    {

       
        $tasks = Task::where('estado', 1)->where('user_id',$id)->get();

        if ($tasks->isEmpty()) {
            return response()->json(['message' => 'No hay tareas'], 404);
        }
        return response()->json(['tasks' => $tasks], 200);
    }

    public function getTaskById($id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['message' => 'Tarea no encontrada'], 404);
        }
        return response()->json(['task' => $task], 200);
    }

    public function updateTask(Request $request, $id)
    {
        $task = Task::find($id);     
        
        Gate::authorize('manage-task', $task);
        if (!$task) {
            return response()->json(['message' => 'Tarea no encontrada'], 404);
        }
        $validator = Validator::make($request->all(), [
            'titulo' => 'sometimes|string|max:255',
            'descripcion' => 'sometimes|string',
            'estado' => 'boolean',            
        ]);
      
        if ($request->has('titulo')) {
            $task->titulo = $request->titulo;
        }
        if ($request->has('descripcion')) {
            $task->descripcion = $request->descripcion;
        }
        if ($request->has('estado')) {
            $task->estado = $request->estado;
        }
        $task->save();
        return response()->json(['message' => 'Tarea actualizada'], 200);

    }

    public function deleteTask($id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['message' => 'Tarea no encontrada'], 404);
        }
        $task->delete();
        return response()->json(['message' => 'Tarea eliminada'], 200);
    }

}
