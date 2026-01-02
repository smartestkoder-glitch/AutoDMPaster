import func from "../Bots utils/function.js"
import look from "./look.js";

const rubbish = {

    /**
     * Выкидывает все предметы кроме тех, которые в вайтлист
     * @param {import('mineflayer').Bot} bot
     * @param changeLook
     * @param whiteList
     */
    all: async (bot, changeLook = true, whiteList = []) => {

        if (changeLook) {
            await look.look(bot, -9.3652565343, -1.99897428364)
            await func.delay(500)
        }

        for (const slot of bot.inventory.slots) {
            if (!slot) continue

            if (whiteList.includes(slot.name)) continue

            await bot.tossStack(slot)
            await func.delay(100)
        }
    }

}

export default rubbish