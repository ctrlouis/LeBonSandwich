# API LeBonSandwich

Groupe: Allan Izzi, Louis Bertschy, Victor Bour.
Lien vers le github : https://github.com/ctrlouis/LeBonSandwich
Api doc: https://documenter.getpostman.com/view/10811943/SzS8s5PD?version=latest

## Mise en route

1. Lancer le container Docker (l'installation des modules npm se fera lors du démarrage du container);
```
$ docker-compose up --build
```

2. Rendez vous sur adminer avec :
http://localhost:8080/?server=mysql.commande&username=command_lbs&db=command_lbs

3. Connectez vous a la base de données avec les identifiants suivant :
- server: mysql.commande
- username: command_lbs
- password: command_lbs
- database: command_lbs

4. Importer le fichier `commande_api/sql/schema.sql` dans la base de données command_lbs

5.Importer la base de données dans la base mongo pour l'API catalogue

```
docker exec -it [CONTAINER_SHA1] /bin/bash

mongoimport --db catalogue_lbs --collection categories --file /init/categories.json --jsonArray && mongoimport --db catalogue_lbs --collection sandwichs --file /init/sandwichs.json --jsonArray
```
