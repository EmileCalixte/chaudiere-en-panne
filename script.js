var DIALOG_CONFIRMATION_START_MESSAGE = "Do you want to start the system?";

var menu = document.querySelector(".desktop-screen.d-menu-bar");
var onOffButton = Array.from(Array.from(menu.children)[1].children)[0];

function getCurrentDateTime() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function log(...data) {
    console.log(getCurrentDateTime(), ...data);
}

async function sleep(ms) {
    return new Promise(resolve => { setTimeout(resolve, ms) });
}

function getActiveDialog() {
    return document.querySelector(".v-dialog--active");
}

function confirmActiveDialog() {
    var dialog = getActiveDialog();
    var confirmButton = Array.from(dialog.querySelectorAll(".v-card .v-card__actions button"))[1];
    confirmButton.click();
}

function cancelActiveDialog() {
    var dialog = getActiveDialog();
    var cancelButton = Array.from(dialog.querySelectorAll(".v-card .v-card__actions button"))[0];
    cancelButton.click();
}

async function resetAlarm() {
    var resetAlarmButton = document.querySelector(".reset-alarm");

    log("Clic sur le bouton RESET ALARM");
    resetAlarmButton.click();

    await sleep(1000);

    log("Clic sur OK pour reset l'alarme");
    confirmActiveDialog();
}

async function restartChaudiereIfStopped() {
    log("Clic sur le bouton ON/OFF");
    onOffButton.click();

    await sleep(1000);

    var dialog = document.querySelector(".v-dialog--active");
    var dialogText = dialog.querySelector(".v-card .v-card__text p").innerText;

    if (dialogText !== DIALOG_CONFIRMATION_START_MESSAGE) {
        log("La chaudière semble déjà démarrée, clic sur sur ANNULER pour fermer la modale");
        cancelActiveDialog();

        return;
    }

    log("Clic sur OK pour démarrer la chaudière");
    confirmActiveDialog();
}

async function resetAndRestartIfNeeded() {
    var resetAlarmButton = document.querySelector(".reset-alarm");

    if (!resetAlarmButton) {
        log("La chaudière n'est pas en alarme");
    } else {
        await resetAlarm();
        log("Attend 30 secondes pour être sûr que l'interface s'est actualisée");
        await sleep(10000);
        log("Encore 20 secondes");
        await sleep(10000);
        log("Encore 10 secondes");
        await sleep(10000);
    }

    restartChaudiereIfStopped();
}

(async () => {
    resetAndRestartIfNeeded();

    log("Activation de la vérification périodique toutes les 60 secondes");
    setInterval(resetAndRestartIfNeeded, 60000);
})()
