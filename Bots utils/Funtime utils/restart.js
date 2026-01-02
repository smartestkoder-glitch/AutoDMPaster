import func from "../function.js";
import connect from "../connect.js";


const restart = {
    default: async (bot, msg = "!Не определена!") => {
        bot.removeAllListeners()
        bot._client.removeAllListeners()
        bot.smart.vars.work = false
        bot._client.socket.destroy()
        func.output(`Бота с ником ${bot.username} был кикнут по причине: ` + msg, undefined,"red", "bold")
        process.exit(0)

        //await func.delay(500)
        //await func.delay(30000)
        //await connect(bot.smart.vars.settings.username, bot.smart.vars.settings.server, bot.smart.vars.settings.anarchy, bot.smart.vars.script.threeBot.anarchyRepait, bot.smart.vars.settings.version, bot.smart.vars.settings.port, bot.smart.vars.settings.proxy, bot.smart.vars.settings.script)
        //bot = null
    }
}

export default restart