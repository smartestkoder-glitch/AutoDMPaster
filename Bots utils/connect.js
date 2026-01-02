import mineflayer from "mineflayer"
import func from "./function.js"
import restart from "../Bots utils/Funtime utils/restart.js"
import startEvent from "./startEvent.js"
import {SocksClient as socks} from "socks";
import moneyFT from "./Funtime utils/moneyFT.js";
import donate from "./Funtime utils/detectDonate.js";


/**
 *
 * @param username
 * @param server
 * @param port
 * @param config
 * @returns {import('mineflayer').Bot}
 */
async function connect(username, server, port, config = {}) {


    let connect = false

    func.output("Бот с ником " + username + " пытается подключается к серверу...", undefined, "white", "bold")
    if (config.proxy) {
        const proxyOpt = config.proxy.split(":");

        connect = async (client) => {
            func.output('Попытка подключения к прокси...', undefined, "white", "bold");
            await socks.createConnection({
                proxy: {
                    host: proxyOpt[0],
                    port: Number(proxyOpt[1]),
                    type: 5,
                    userId: proxyOpt[2],
                    password: proxyOpt[3]
                },
                command: 'connect',
                destination: {
                    host: server,
                    port: 25565
                },
            }, (err, info) => {
                if (err) {
                    func.output("Ошибка подключения к прокси!", undefined, "red", "bold");
                    return;
                }
                func.output('Соединение с прокси установлено.', undefined, "white", "bold");
                client.setSocket(info.socket);
                client.emit('connect');
            });
        };


    }
    let bot = mineflayer.createBot({
        host: server,
        port: port,
        username: username,
        version: config.version,
        connect: connect,
        hideErrors: true
    });
    bot.smart = {
        vars: {
            work: true,

            settings: {
                username: username,
                server: server,
                version: config.version,
                port: port,
                proxy: config.proxy,
                anarchy: config.anarchy,
                script: config.script,
                cdms: 7000
            },

            donate: "",

            money: {
                balance: 0,
                clan: 0,
                allTime: 0
            },

            default: {
                clickerAttack: false,
                autoJump: false,
                minClanInvest: 50000000
            },

            script: {
                cocoa_beans: {
                    clicker: {
                        dig: false,
                        place: false
                    }
                },
                auto_repair: false,

                threeBot: {
                    clanInvest: 0,
                    anarchyRepait: config.anarchyRepait
                },
                nether_wart: {
                    dig_clicker: false,
                    place_clicker: false,
                    last_coords_break: -10000,
                    last_coords_place: -10000,
                    restack: false
                },

                autoSell: {
                    lastResellMin: -1,
                    lastResellSec: -1
                }
            }
        }
    }

    //Спец вызовы, потом перенести!!!
    moneyFT.moneyUpdateEvent(bot)
    donate.startDetect(bot)
    //!!!

    func.output("Бот с ником " + username + " успешно подключен к серверу", undefined, "white", "bold")

    bot.once("spawn", () => {
        func.output("Выполнение скрипта начато у бота с ником " + username + "\n\n", undefined, "white", "bold")

        startEvent.allScripts(bot, config.script).catch((e) => {restart.default(bot, e)})
    })


    return bot
}

export default connect;
