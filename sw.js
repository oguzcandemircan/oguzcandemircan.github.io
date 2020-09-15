/**
PWA Service Worker
**/
/** Install **/
self.addEventListener("install", function(event) {
    console.log("[Service Worker] Installing Service Worker...");
});
/** Active **/
self.addEventListener("activate", function(event) {
    console.log("[Service Worker] Activating Service Worker...");
    return self.clients.claim();
});
/** Prompt **/
self.addEventListener("beforeinstallprompt", function(event) {
    event.prompt();
});
