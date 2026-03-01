<?php

// ACBIM contact form endpoint (OVH/PHP V1)
// - Works with a static-exported site (Next.js output + FTP)
// - Accepts POST form submissions
// - Returns JSON for fetch() requests, HTML fallback otherwise

$CONTACT_TO_PRIMARY = 'mopus3d@gmail.com';
$CONTACT_TO_BACKUP = '';
$CONTACT_FROM_EMAIL = 'no-reply@acbimcloud.fr';
$CONTACT_FROM_NAME = 'ACBIM';
$CONTACT_RETURN_PATH = 'no-reply@acbimcloud.fr';
$CONTACT_REPLY_TO_FIXED = 'no-reply@acbimcloud.fr';
$FORM_MAIL_SMOKE_TEST_ENABLED = false;
$FORM_MAIL_SMOKE_TEST_TO = 'mopus3d@gmail.com';
$FORM_MAIL_SMOKE_TEST_TEMPLATE = 'T1';
$MAIL_LOG_PATH = __DIR__ . '/contact-mail.log';
$LEADS_LOG_PATH = __DIR__ . '/contact-leads.ndjson';
$SUBMISSIONS_DIR_PATH = __DIR__ . '/submissions';
$SUBMISSIONS_COUNTER_PATH = __DIR__ . '/submissions-counter.txt';
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

function acbim_build_mailbox_header($displayName, $email) {
    $safeEmail = acbim_clean_header_value($email);
    if ($safeEmail === '') {
        return '';
    }

    $safeName = acbim_clean_header_value($displayName);
    if ($safeName === '') {
        return $safeEmail;
    }

    return sprintf('"%s" <%s>', str_replace('"', "'", $safeName), $safeEmail);
}

function acbim_normalize_message($value) {
    $value = str_replace(array("\r\n", "\r"), "\n", (string) $value);
    $value = preg_replace("/\n{3,}/", "\n\n", $value);
    return trim($value);
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

function acbim_store_lead($filePath, $lead) {
    $line = json_encode($lead, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($line === false) {
        return false;
    }

    return @file_put_contents($filePath, $line . "\n", FILE_APPEND) !== false;
}

function acbim_ensure_directory($dirPath) {
    if (is_dir($dirPath)) {
        return true;
    }

    return @mkdir($dirPath, 0755, true);
}

function acbim_protect_directory($dirPath) {
    $htaccessPath = rtrim($dirPath, '/\\') . DIRECTORY_SEPARATOR . '.htaccess';
    if (is_file($htaccessPath)) {
        return true;
    }

    $rules = array(
        'Require all denied',
        '<IfModule !mod_authz_core.c>',
        'Deny from all',
        '</IfModule>',
    );

    return @file_put_contents($htaccessPath, implode("\n", $rules) . "\n") !== false;
}

function acbim_next_sequence($counterPath) {
    $handle = @fopen($counterPath, 'c+');
    if ($handle === false) {
        return false;
    }

    if (!@flock($handle, LOCK_EX)) {
        @fclose($handle);
        return false;
    }

    $raw = stream_get_contents($handle);
    $current = (is_string($raw) && ctype_digit(trim($raw))) ? (int) trim($raw) : 0;
    $next = $current + 1;

    @ftruncate($handle, 0);
    @rewind($handle);
    @fwrite($handle, (string) $next);
    @fflush($handle);
    @flock($handle, LOCK_UN);
    @fclose($handle);

    return $next;
}

function acbim_archive_submission($dirPath, $counterPath, $requestId, $lead) {
    if (!acbim_ensure_directory($dirPath)) {
        return array('ok' => false, 'error' => 'cannot create submissions directory');
    }
    if (!acbim_protect_directory($dirPath)) {
        return array('ok' => false, 'error' => 'cannot protect submissions directory');
    }

    $sequence = acbim_next_sequence($counterPath);
    if ($sequence === false) {
        return array('ok' => false, 'error' => 'cannot increment submissions counter');
    }

    $sequenceLabel = str_pad((string) $sequence, 6, '0', STR_PAD_LEFT);
    $stamp = date('Ymd-His');
    $baseName = $sequenceLabel . '-' . $stamp . '-' . $requestId;
    $jsonFileName = $baseName . '.json';
    $txtFileName = $baseName . '.txt';
    $jsonPath = rtrim($dirPath, '/\\') . DIRECTORY_SEPARATOR . $jsonFileName;
    $txtPath = rtrim($dirPath, '/\\') . DIRECTORY_SEPARATOR . $txtFileName;

    $jsonData = json_encode($lead, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($jsonData === false || @file_put_contents($jsonPath, $jsonData . "\n") === false) {
        return array('ok' => false, 'error' => 'cannot write submission json');
    }

    $txtLines = array(
        'ACBIM - Nouvelle demande formulaire',
        'sequence=' . $sequenceLabel,
        'request_id=' . $requestId,
        'created_at=' . (isset($lead['created_at']) ? (string) $lead['created_at'] : ''),
        'name=' . (isset($lead['name']) ? (string) $lead['name'] : ''),
        'email=' . (isset($lead['email']) ? (string) $lead['email'] : ''),
        'subject=' . (isset($lead['subject']) ? (string) $lead['subject'] : ''),
        'origin_url=' . (isset($lead['origin_url']) ? (string) $lead['origin_url'] : ''),
        '',
        'message:',
        (isset($lead['message']) ? (string) $lead['message'] : ''),
    );
    if (@file_put_contents($txtPath, implode("\n", $txtLines) . "\n") === false) {
        return array('ok' => false, 'error' => 'cannot write submission txt');
    }

    return array(
        'ok' => true,
        'sequence' => $sequenceLabel,
        'json_file' => $jsonFileName,
        'txt_file' => $txtFileName,
        'json_path' => $jsonPath,
        'txt_path' => $txtPath,
    );
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

$cleanEmail = acbim_clean_header_value($email);
$cleanSubject = acbim_clean_header_value($subject);

$mailSubject = '[' . $SITE_NAME . ' CONTACT] ' . $cleanSubject . ' #' . $requestId;

$bodyLines = array(
    'ACBIM contact form',
    'request_id=' . $requestId,
    '',
    'name=' . $name,
    'email=' . $email,
    'subject=' . $subject,
    '',
    'message:',
    $message,
    '',
    'created_at=' . date('c'),
);

if ($originUrl !== '') {
    $bodyLines[] = 'origin_url=' . $originUrl;
}

$mailBody = implode("\n", $bodyLines);

$leadData = array(
    'request_id' => $requestId,
    'created_at' => date('c'),
    'name' => $name,
    'email' => $email,
    'subject' => $subject,
    'message' => $message,
    'origin_url' => $originUrl,
    'ip' => acbim_client_ip(),
    'user_agent' => isset($_SERVER['HTTP_USER_AGENT']) ? (string) $_SERVER['HTTP_USER_AGENT'] : 'unknown',
);

$leadSaved = acbim_store_lead($LEADS_LOG_PATH, $leadData);
$archiveResult = acbim_archive_submission($SUBMISSIONS_DIR_PATH, $SUBMISSIONS_COUNTER_PATH, $requestId, $leadData);

$fromHeaderValue = acbim_build_mailbox_header($CONTACT_FROM_NAME, $CONTACT_FROM_EMAIL);
$notificationTo = acbim_clean_header_value($CONTACT_TO_PRIMARY);
if (!filter_var($notificationTo, FILTER_VALIDATE_EMAIL)) {
    acbim_log_mail_event($MAIL_LOG_PATH, $requestId, 'error', 'invalid notification recipient configured');
    acbim_respond(500, false, 'Configuration email invalide. Merci de nous contacter directement.');
}

if (!$leadSaved) {
    acbim_log_mail_event($MAIL_LOG_PATH, $requestId, 'warn', 'lead not saved on disk path=' . $LEADS_LOG_PATH);
}
if (!$archiveResult['ok']) {
    acbim_log_mail_event($MAIL_LOG_PATH, $requestId, 'warn', 'submission archive not saved detail=' . $archiveResult['error']);
}

$headers = array(
    'From: ' . $fromHeaderValue,
);

$notificationSubject = '[ACBIM MAIL TEST] ' . $requestId . ' T1-FORM';
$archiveRef = $archiveResult['ok']
    ? 'sequence=' . $archiveResult['sequence'] . ' json=' . $archiveResult['json_file'] . ' txt=' . $archiveResult['txt_file']
    : 'archive=unavailable';
$notificationBody = "ACBIM test T1\nrequest_id=" . $requestId . "\nmode=form-notify-archive\n" . $archiveRef . "\n";
$mailSent = @mail(
    $notificationTo,
    $notificationSubject,
    $notificationBody,
    implode("\r\n", $headers),
    '-f' . $CONTACT_RETURN_PATH
);

if (!$mailSent) {
    acbim_log_mail_event(
        $MAIL_LOG_PATH,
        $requestId,
        'error',
        'mail() returned false mode=form-notify-archive to=' . $notificationTo . ' from=' . $CONTACT_FROM_EMAIL . ' client_email=' . $cleanEmail . ' archive_ok=' . ($archiveResult['ok'] ? 'yes' : 'no')
    );
    acbim_respond(500, false, 'Le message n a pas pu etre envoye pour le moment. Reference: ' . $requestId . '. Merci de reessayer ou de nous contacter par email.');
}

acbim_log_mail_event(
    $MAIL_LOG_PATH,
    $requestId,
    'ok',
    'mail() accepted by server mode=form-notify-archive to=' . $notificationTo . ' from=' . $CONTACT_FROM_EMAIL . ' client_email=' . $cleanEmail . ' subject=' . $cleanSubject . ' archive_ok=' . ($archiveResult['ok'] ? 'yes' : 'no') . ($archiveResult['ok'] ? ' sequence=' . $archiveResult['sequence'] : '')
);
acbim_respond(200, true, 'Message envoye. Merci, nous revenons vers vous rapidement. Reference: ' . $requestId . '.');
