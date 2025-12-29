import func from "../../Bots utils/function.js";
import window from "../../Bots utils/window.js";
import autoDMconfig from "../../Bots settings/autoDMconfig.js";
import restart from "../../Bots utils/Funtime utils/restart.js";
import parseDM from "./parseDM.js";
import dbAPI from "smartdbapi";
import autoDMDatabaseFunc from "./database.js";
import autoJump from "../../Bots utils/Funtime utils/autoJump.js";

const autoDM = {

    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param lastSlot
     * @param maxTime
     * @returns {Promise<void>}
     */
    waitLoadAllSlots: async (bot, lastSlot = 45, maxTime = 10000) => {
        let time = 0
        while((bot.currentWindow?.slots.slice(0, lastSlot).filter(el => el?.name).length !== lastSlot) && bot.smart.vars.work) {
            await func.delay(30)
            time += 30
            if (time > maxTime) {
                func.output("Превышено время ожидания появления слота!", undefined, "red", "bold")
                return
            }
        }
    },


    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @returns {Promise<void>}
     */
    openDM: async (bot) => {
        bot.chat("/dm")
        await window.waitToSlot(bot, 21, "gold_ingot", 10000)
        window.click(bot, 21)

        await window.waitToSlot(bot, 49, "nether_star", 10000)
    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @returns {Promise<void>}
     */
    autoDMChecker: async (bot) => {
        await func.delay(500)
        //autoJump.autoJump(bot, 15000, true)

        let parse = {}

        let dm = parseDM.decoder(bot)


        while (bot.smart.vars.work) {
            func.output("Начал чекать...", undefined, "green", "bold")

            while (bot.currentWindow) {


                dm = parseDM.decoder(bot)
                if (dm.data.length !== 45) {

                    func.output(dm.data.length, undefined, "red", "bold")

                }
                //console.log(dm)
                if ((JSON.stringify(dm) !== JSON.stringify(parse)) && dm.data.length === 45) {
                    await autoDMDatabaseFunc.addPage(dm.data, dm.marketMy)
                }
                parse = dm

                window.click(bot, 49)

                await func.delay(500)

                await autoDM.waitLoadAllSlots(bot)
            }
            return restart.default(bot, "Окно закрылось ёпта")
        }

    }

}

export default autoDM