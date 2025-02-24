# iut-project
Cette application est un projet Node.js utilisant Hapi.js, Schwifty (pour la gestion des modèles via Objection.js) et @hapipal/schmervice pour organiser la logique métier. 

- Fonctionnalités principales -

    Gestion des utilisateurs
        Création d’un utilisateur (avec vérification d’unicité de l’email et envoi d’un mail de bienvenue via Nodemailer).
        Authentification via JWT, avec gestion des scopes (user/admin).
        Consultation, modification et suppression d’utilisateurs (accès protégé par les scopes).

    Gestion des films
        Création, consultation, modification et suppression de films (réservé aux utilisateurs avec le scope admin).
        Affichage de la liste des films disponibles.

    Films favoris (en cours)
        Possibilité pour un utilisateur d'ajouter/supprimer un film de ses favoris.
        Affichage de la liste de ses films favoris.

    Fonctionnalités à venir
        Notifications : Envoi d'emails aux utilisateurs en cas d'ajout ou de modification d'un film.
        Message broker : Export CSV des films accessible uniquement aux admins via un envoi par mail.
        Tests unitaires : Implémentation de tests avec Lab pour améliorer la couverture du code.


- Installation - 

    cloner le projet : 
        git clone https://github.com/AureKoudert/iut-project.git

    se positionner à l'intérieur : 
        cd iut-project.git

    installer les dépendances : 
        npm install

    lancer les migrations si besoin : 
        npx knex migrate:latest


- Lancement -

    lancer le serveur avec :
        npm start

    Vous devriez voir "Server started at http://localhost:3000"

    Une fois le serveur, rendez-vous sur http://localhost:3000/documentation

    Sous l'onglet "user", cliquez sur la route POST /user/login, puis sur le bouton "Try it out", puis "Execute", cela vous affichera une réponse type :
        {
        "login": "successful",
        "token": "[votre token]"
        }

    Récupérez ce token et en haut de la page entrez le dans le menu "Authorize" avec l'entête Bearer de cette manière :
        Bearer [votre token]

    Puis testez les différentes routes