<?php

namespace App\Http\Middleware;
use Exception;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
class IsUserAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    /*public function handle(Request $request, Closure $next): Response
    {
       
        if (auth('api')->user()) {
            return $next($request);
        }else{
        return response()->json(['message' => 'No autorizado'], 401);
        }
        // return $next($request);
    }*/

    public function handle($request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

        } catch (Exception $e) {
            return response()->json(['message' => 'Token inválido o no enviado'], 401);
        }

        return $next($request);
    }
}
