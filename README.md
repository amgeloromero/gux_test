
# Proyecto backend

## pasos proyecto laravel

1- configurar .env (con datos de la base mysql)
2- ubicarse en la carpeta bknd y en consola digitar lo siguiente para instalar los paquetes del proyecto:
```bash
  composer install
```  
3- luego ejecutar las migraciones:

```bash
  php artisan migrate
```  
4- en consola digitar lo siguiente:  
```bash
php artisan serve --port=8787
```  


## nota
- para ver el modo admin hay que cambiar el tipo de usuario en la bdd "admin" ya que acepta dos tipos "admin" o "user"
- el archivo GUX.postman_collection.json es para importar en postman y probar la api


# Proyecto front

## pasos proyecto react
1- ubicarse en la carpeta front y  digitar lo siguiente:
```bash
npm install
npm run dev
``` 