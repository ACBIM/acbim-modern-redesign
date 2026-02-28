<?php

// ACBIM contact form endpoint (OVH/PHP V1)
// - Works with a static-exported site (Next.js output + FTP)
// - Accepts POST form submissions
// - Returns JSON for fetch() requests, HTML fallback otherwise

$CONTACT_TO = 'contact@acbim.fr';
$CONTACT_FROM = 'no-reply@acbimcloud.fr';
$MAIL_LOG_PATH = __DIR__ . '/contact-mail.log';
$SITE_NAME = 'ACBIM';
$MIN_SUBMIT_DELAY_MS = 1500;
$MAX_NAME_LENGTH = 120;
$MAX_EMAIL_LENGTH = 180;
$MAX_SUBJECT_LENGTH = 180;
$MAX_MESSAGE_LENGTH = 5000;
$ALLOWED_ORIGINS = array(
    'https://www.aura-bim.fr',
    'https://aura-bim.fr',
    'https://acbimcloud.fr',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
);

function acbim_request_header($name) {
    $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    return isset($_SERVER[$key]) ? (string) $_SERVER[$key] : '';
}

function acbim_wants_json() {
    $accept = acbim_request_header('Accept');
    $requestedWith = acbim_request_header('X-Requested-With');

    return stripos($accept, 'application/json') !== false || strcasecmp($requestedWith, 'XMLHttpRequest') === 0;
}

function acbim_is_allowed_origin($origin, $allowedOrigins) {
    if ($origin === '') {
        return false;
    }

    if (in_array($origin, $allowedOrigins, true)) {
        return true;
    }

    return preg_match('/^https:\/\/[a-z0-9-]+\.pages\.dev$/i', $origin) === 1;
}

function acbim_apply_cors_headers($allowedOrigins) {
    $origin = trim(acbim_request_header('Origin'));

    if ($origin === '' || !acbim_is_allowed_origin($origin, $allowedOrigins)) {
        return;
    }

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Accept, Content-Type, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
}

function acbim_handle_preflight($allowedOrigins) {
    $method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string) $_SERVER['REQUEST_METHOD']) : 'GET';
    if ($method !== 'OPTIONS') {
        return;
    }

    $origin = trim(acbim_request_header('Origin'));
    if (!acbim_is_allowed_origin($origin, $allowedOrigins)) {
        http_response_code(403);
        header('Content-Type: text/plain; charset=UTF-8');
        echo 'Origin non autorisee.';
        exit;
    }

    acbim_apply_cors_headers($allowedOrigins);
    http_response_code(204);
    exit;
}

function acbim_json_response($statusCode, $payload) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function acbim_html_response($statusCode, $ok, $message) {
    http_response_code($statusCode);
    header('Content-Type: text/html; charset=UTF-8');

    $title = $ok ? 'Message envoye' : 'Erreur formulaire';
    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

    $scriptName = isset($_SERVER['SCRIPT_NAME']) ? (string) $_SERVER['SCRIPT_NAME'] : '/contact.php';
    $scriptDir = str_replace('\\', '/', dirname($scriptName));
    $basePath = ($scriptDir === '/' || $scriptDir === '.') ? '' : rtrim($scriptDir, '/');
    $backUrl = $basePath . '/contact/';
    $safeBackUrl = htmlspecialchars($backUrl, ENT_QUOTES, 'UTF-8');

    echo '<!doctype html><html lang="fr"><head>';
    echo '<meta charset="UTF-8">';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    echo '<meta name="robots" content="noindex, nofollow">';
    echo '<title>' . $safeTitle . ' - ACBIM</title>';
    echo '<style>';
    echo 'body{margin:0;font-family:Arial,sans-serif;background:#0f172a;color:#e2e8f0;display:grid;min-height:100vh;place-items:center;padding:24px;}';
    echo '.card{max-width:640px;background:rgba(15,23,42,.78);border:1px solid rgba(148,163,184,.2);border-radius:16px;padding:24px;box-shadow:0 20px 40px rgba(2,6,23,.25);}';
    echo 'h1{margin:0 0 12px;font-size:24px;} p{margin:0 0 20px;line-height:1.5;} a{display:inline-block;padding:12px 18px;border-radius:999px;background:#ee7527;color:#fff;text-decoration:none;font-weight:700;}';
    echo '</style></head><body><div class="card">';
    echo '<h1>' . $safeTitle . '</h1>';
    echo '<p>' . $safeMessage . '</p>';
    echo '<a href="' . $safeBackUrl . '">Retour au site</a>';
    echo '</div></body></html>';
    exit;
}

function acbim_respond($statusCode, $ok, $message) {
    $payload = array(
        'ok' => (bool) $ok,
        'message' => (string) $message,
    );

    if (acbim_wants_json()) {
        acbim_json_response($statusCode, $payload);
    }

    acbim_html_response($statusCode, $ok, $message);
}

function acbim_get_post($key) {
    return isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
}

function acbim_clean_header_value($value) {
    $value = preg_replace("/[\r\n]+/", ' ', (string) $value);
    return trim($value);
}

function acbim_normalize_message($value) {
    $value = str_replace(array("\r\n", "\r"), "\n", (string) $value);
    $value = preg_replace("/\n{3,}/", "\n\n", $value);
    return trim($value);
}

function acbim_encode_mime_header_utf8($value) {
    return '=?UTF-8?B?' . base64_encode((string) $value) . '?=';
}

function acbim_client_ip() {
    if (!empty($_SERVER['REMOTE_ADDR'])) {
        return (string) $_SERVER['REMOTE_ADDR'];
    }
    return 'unknown';
}

function acbim_assert_post_method() {
    $method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string) $_SERVER['REQUEST_METHOD']) : 'GET';
    if ($method !== 'POST') {
        acbim_respond(405, false, 'Methode non autorisee. Utilisez le formulaire de contact du site.');
    }
}

function acbim_log_mail_event($logPath, $requestId, $status, $detail) {
    $line = sprintf(
        "[%s] request=%s status=%s detail=%s ip=%s ua=%s\n",
        date('c'),
        $requestId,
        $status,
        str_replace(array("\r", "\n"), ' ', (string) $detail),
        acbim_client_ip(),
        str_replace(array("\r", "\n"), ' ', isset($_SERVER['HTTP_USER_AGENT']) ? (string) $_SERVER['HTTP_USER_AGENT'] : 'unknown')
    );

    @file_put_contents($logPath, $line, FILE_APPEND);
}

acbim_apply_cors_headers($ALLOWED_ORIGINS);
acbim_handle_preflight($ALLOWED_ORIGINS);
acbim_assert_post_method();

$honeypot = acbim_get_post('website');
if ($honeypot !== '') {
    // Silent success for bots
    acbim_respond(200, true, 'Message envoye. Merci, nous revenons vers vous rapidement.');
}

$name = acbim_get_post('name');
$email = acbim_get_post('email');
$subject = acbim_get_post('subject');
$message = acbim_get_post('message');
if ($message === '') {
    $message = acbim_get_post('body');
}
$originUrl = acbim_get_post('origin_url');
$formStartedAt = acbim_get_post('form_started_at');
$requestId = bin2hex(random_bytes(4));

if ($formStartedAt !== '' && ctype_digit($formStartedAt)) {
    $submittedAtMs = (int) $formStartedAt;
    $nowMs = (int) round(microtime(true) * 1000);
    $elapsedMs = $nowMs - $submittedAtMs;

    if ($elapsedMs >= 0 && $elapsedMs < $MIN_SUBMIT_DELAY_MS) {
        acbim_respond(429, false, 'Envoi trop rapide. Merci de patienter un instant puis de reessayer.');
    }
}

if ($name === '' || strlen($name) < 2 || strlen($name) > $MAX_NAME_LENGTH) {
    acbim_respond(422, false, 'Merci de renseigner un nom valide.');
}

if ($email === '' || strlen($email) > $MAX_EMAIL_LENGTH || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    acbim_respond(422, false, 'Merci de renseigner une adresse email valide.');
}

if ($subject === '' || strlen($subject) < 3 || strlen($subject) > $MAX_SUBJECT_LENGTH) {
    acbim_respond(422, false, 'Merci de renseigner un sujet valide.');
}

$message = acbim_normalize_message($message);
if ($message === '' || strlen($message) < 10 || strlen($message) > $MAX_MESSAGE_LENGTH) {
    acbim_respond(422, false, 'Merci de renseigner un message valide (10 caracteres minimum).');
}

$cleanName = acbim_clean_header_value($name);
$cleanEmail = acbim_clean_header_value($email);
$cleanSubject = acbim_clean_header_value($subject);

$mailSubject = '[' . $SITE_NAME . '] Nouveau message site web - ' . $cleanSubject;

$bodyLines = array(
    'Nouveau message recu depuis le formulaire du site ACBIM.',
    'Reference technique : ' . $requestId,
    '',
    'Nom : ' . $name,
    'Email : ' . $email,
    'Sujet : ' . $subject,
    '',
    'Message :',
    $message,
    '',
    '---',
    'Date serveur : ' . date('c'),
    'IP : ' . acbim_client_ip(),
    'User-Agent : ' . (isset($_SERVER['HTTP_USER_AGENT']) ? (string) $_SERVER['HTTP_USER_AGENT'] : 'unknown'),
);

if ($originUrl !== '') {
    $bodyLines[] = 'Page d origine : ' . $originUrl;
}

$mailBody = implode("\n", $bodyLines);

$headers = array(
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $SITE_NAME . ' <' . $CONTACT_FROM . '>',
    'Sender: ' . $CONTACT_FROM,
    'Reply-To: ' . $cleanEmail,
    'X-ACBIM-Request-Id: ' . $requestId,
    'X-Mailer: PHP/' . phpversion(),
);

$mailSent = @mail(
    $CONTACT_TO,
    acbim_encode_mime_header_utf8($mailSubject),
    $mailBody,
    implode("\r\n", $headers),
    '-f' . $CONTACT_FROM
);

if (!$mailSent) {
    acbim_log_mail_event($MAIL_LOG_PATH, $requestId, 'error', 'mail() returned false');
    acbim_respond(500, false, 'Le message n a pas pu etre envoye pour le moment. Reference: ' . $requestId . '. Merci de reessayer ou de nous contacter par email.');
}

acbim_log_mail_event($MAIL_LOG_PATH, $requestId, 'ok', 'mail() accepted by server');
acbim_respond(200, true, 'Message envoye. Merci, nous revenons vers vous rapidement. Reference: ' . $requestId . '.');
