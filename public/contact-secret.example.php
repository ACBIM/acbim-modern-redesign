<?php
// MODELE — ne contient PAS de secret.
// Sur OVH, copiez ce fichier en "contact-secret.php" (a cote de contact.php)
// et collez votre Secret Key Cloudflare Turnstile.
// Le fichier "contact-secret.php" ne doit PAS etre versionne (voir .gitignore).
return array(
    'turnstile_secret' => '0xVOTRE_SECRET_KEY_TURNSTILE_ICI',
);
