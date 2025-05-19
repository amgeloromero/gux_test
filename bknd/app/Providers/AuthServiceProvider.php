<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Models\Task;
class AuthServiceProvider extends ServiceProvider
{
    public function boot()
    {
       // $this->registerPolicies();    
        Gate::define('manage-task', function ($user, Task $task) {      
            return $user->id === $task->user_id;
        });
    }
}