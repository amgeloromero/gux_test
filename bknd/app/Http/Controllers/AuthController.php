<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
//use Tymon\JWTAuth\Contracts\Providers\Auth;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'role' => 'required|string|in:admin,user',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|max:20|confirmed',
        ]);




        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }


        $user = User::create([
            'name' => $request->input('name'),
            'role' => $request->input('role'),
            'email' => $request->input('email'),
            'password' => bcrypt($request->input('password')),
        ]);
        //  $token = $user->createToken('authToken')->plainTextToken;
        return response()->json(['message' => "Usuario creado con exito!!"], 201);
    }

    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [

            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }


        $credentials = $request->only('email', 'password');

       // dd($credentials);
        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['message' => 'Credenciales inválidas'], 401);
            }

            if ($token = JWTAuth::attempt($credentials)) {
               // $user = auth()->user();
              //  $token = $user->createToken('authToken')->plainTextToken;
                return response()->json(['token' => $token], 200);
            } else {
                return response()->json(['message' => 'Credenciales inválidas'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['message' => 'Error al generar el token'], 500);
        }
    }

    public function getUser(Request $request)
    {
       $user =Auth::user();
        return response()->json(['user' => $user], 200);
    }

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function deleteUserById($id)
    {
       
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'Usuario eliminado'], 200);
      /*  $user = Auth::user();
        $user->delete();
        return response()->json(['message' => 'Usuario eliminado'], 200);*/
    }
    public function getUsers()
    {
        $users = User::all();
        return response()->json(['users' => $users], 200);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        $user->name = $request->input('name');
        $user->role = $request->input('role');
        $user->email = $request->input('email');
        $user->save();
        return response()->json(['message' => 'Usuario actualizado'], 200);
    }



    public function logout()
    {

        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Sesión cerrada'], 200);
       // auth()->user()->tokens()->delete();
       // return response()->json(['message' => 'Sesión cerrada'], 200);
    }
}
