const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}
const qrCode = require('qrcode');
const http = require('http');
const client = new Client({ puppeteer: { headless: false }, session: sessionCfg });
client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});


var server = http.createServer(function (req, res) {
    client.on('qr', async (qr) => {
        var gambar = await qrCode.toDataURL(qr);
        var body = "<center><img src='" + gambar + "'></img><br/>Silahkan scan qrcode ini dengan Whatsapp</center>";
        console.log(qr);
        res.writeHead(200, {
            'Content-Length': body.length,
            'Content-Type': 'text/html',
            'Pesan-Header': 'Bot Absensi Acara FOSTI'
        });

        res.write(body);
    });
    client.on('ready', () => {
        console.log("conek")
        var body = "<center><h1>Berhasil terhubung</h1></center>";

        res.writeHead(200, {
            'Content-Length': body.length,
            'Content-Type': 'text/html',
            'Pesan-Header': 'Bot Absensi Acara FOSTI'
        });

        res.write(body);
    });

});

client.on('message', async msg => {
    var kontak = await msg.getContact();
    console.log("+" + kontak.number + " (" + kontak.pushname + ") - " + msg.body);

    switch (msg.body.toLowerCase()) {
        case "/fosbot":
            msg.reply(
                "Hai, Fostiers Aku FOSBOT bakal nemenin kamu di sini 😆😆\n\nNantinya Fosbot akan hadir juga di Telegram dan Discord\n"+
            "Okay, Aku bisa apa aja sih...\n\n"+
                "1. Fosbot Menyapa\n"+
                "   /fosbot\n\n"+
                "======================\n\n"+
            "2. Informasi Acara Fosti\n"+
            "   /acara\n\n"+
            "======================\n\n"+
            "3. Absensi Acara\n"+
            "   /absensi\n\n"+
            "========================\n\n"+
            "Aku juga bisa kamu Japri looh\naku juga sedang dikembangkan ya, kalau mau berkontribusi ngembangin atau memberi saran fitur ke aku kunjungi github : https://github.com/FOSTI-UMS/bot-absensi")

            break;
        case "/absensi":
            if(kontak.number.isGroup) {
                msg.reply(
                    "Hai,"+kontak.pushname+" Fostiers Kamu Masuk Mode Absensi, kalau mau absensi japri aku aja, masak di grup sih"
                );


            }else{
                msg.reply(
                    "Hai, "+kontak.pushname+"Fitur Ini Masih dalam pengembangan, tungga info lagi yaww"
                );
            }
            break;

        case "/acara":
            msg.reply("Okay, Ini dia event Fosti Terdekat...\n"+
                "RAPAT BESAR FOSTI\n===================\n"+
                "🗓 Hari            : JUM'AT \n" +
                "🗒 Tanggal       : 15 JANUARI 2021\n" +
                "🕟 Jam            : 19.00 ON TIME❤\n" +
                "🏠 Tempat        : VIA GOOGLE MEET"
            );
            break;
        case "/bantuan":
            msg.reply("Okay, Aku bisa apa aja sih...\n1. Informasi Acara Fosti\n/acara\n=======\n2.Absensi\n/absen\n========\nAku juga bisa kamu Japri looh");
            break;
        default:
            break;
    }

});




client.initialize();
server.listen(3000);
