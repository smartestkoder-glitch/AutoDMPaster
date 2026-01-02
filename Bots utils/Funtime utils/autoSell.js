import rubbish from "../rubbish.js";
import window from "../window.js";
import inventory from "../inventory.js";
import func from "../function.js";
import restart from "./restart.js";
import autoBuy from "./autoBuy.js";
import antiAFK from "./antiAFK.js";


const autoSell = {

    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param item
     * @param price
     * @param potion
     * @param priceBuy
     * @param minBuyCount
     * @param minNeedCount
     * @param timeToBuy
     * @param timeToNextPage
     * @param minMoneyCount
     */
    sellOneItem: async (bot, item, price, potion, priceBuy, minBuyCount, minNeedCount, timeToBuy, timeToNextPage, minMoneyCount) => {
        await window.close(bot)
        await rubbish.all(bot, true, [item])
        await antiAFK.randomLook(bot)
        await autoSell.freeSellLine(bot)

        const needItem = inventory.getSlotItem(bot.inventory.slots, item)

        if (!needItem) return autoBuy.multiPageAutoBuy(bot, item, priceBuy, potion, minBuyCount, minNeedCount, timeToBuy, timeToNextPage, minMoneyCount)

        const emptyOnSellLine = inventory.getSlotEmpty(bot, 36, 44)
        if (!emptyOnSellLine) return restart.default(bot, "Ошибка очистки линии!")


        window.click(bot, needItem.slot)
        await func.delay(300)

        window.rightClick(bot, emptyOnSellLine.slot)
        await func.delay(300)

        window.click(bot, needItem.slot)
        await func.delay(300)

        bot.setQuickBarSlot(emptyOnSellLine.slot - 36)
        await func.delay(500)


        const sellSlot = bot.inventory.slots[bot.quickBarSlot + 36]
        if (sellSlot.name !== item || sellSlot.count !== 1) return restart.default("Неверный слот продажи!")

        bot.chat("/ah sell " + price)
        await func.delay(1000)
    },

    sellOneInvis: async (bot, priceSell, priceBuy, buyMinCount = 10, minNeedCount = 10, timeToBuy = 1000, timeToNextPage = 1000, minMoneyCount = 10) => {
          await autoSell.sellOneItem(bot, "potion", priceSell, "minecraft:long_invisibility", priceBuy, buyMinCount, minNeedCount, timeToBuy, timeToNextPage, minMoneyCount)
    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @returns {Promise<void>}
     */
    resell: async (bot) => {
        const date = new Date()
        const lastResellTime = autoSell.getLastResellTime(bot)
        if (!(date.getMinutes() > lastResellTime.min && date.getSeconds() > lastResellTime.sec)) return

        await autoBuy.openAh(bot, "", true)

        window.click(bot, 46)
        await window.waitToChangeNameWindow(bot, 5000)

        await func.delay(500)

        if (bot.currentWindow?.slots[46]?.name !== "tipped_arrow") return restart.default(bot, "Аукцион не открылся для перевыставления!")

        window.click(bot, 52)
        await func.delay(1000)
        autoSell.updateDateResell(bot)

        await window.close(bot)
    },


    updateDateResell: (bot) => {
        bot.smart.vars.script.autoSell.lastResellMin = new Date().getMinutes()
        bot.smart.vars.script.autoSell.lastResellSec = new Date().getSeconds()
    },

    getLastResellTime: (bot) => {
        return {
            min: bot.smart.vars.script.autoSell.lastResellMin,
            sec: bot.smart.vars.script.autoSell.lastResellSec
        }
    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     */
    getSellCountItem: (bot) => {
        if (!bot.currentWindow) return restart.default(bot, "Окно не открыто чтобы узнать сколько предметов продается!")
        if (!window.getNameWindow(bot).includes("Хранилище")) return restart.default(bot, "Открыто не то окно чтобы узнать сколько предметов продается!")


    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @returns {Promise<void>}
     */
    freeSellLine: async (bot) => {
        let i = 0
        while (!inventory.getSlotEmpty(bot.inventory.slots, 36, 44) && i < 9) {

            if (bot.inventory.slots[i+36]) {
                window.shiftClick(bot, i+36)
                await func.delay(200)
            }

            i++
        }

        if (!inventory.getSlotEmpty(bot.inventory.slots, 36, 44)) {
            await restart.default(bot, "Слоты переполнены!")
        }

    }


}

export default autoSell