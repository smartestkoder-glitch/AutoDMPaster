import func from "./function.js"


const window = {


    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param slot
     */
    rightClick: (bot, slot) => {
        if (!bot.smart.vars.work) return

        bot.clickWindow(slot, 1, 0).catch((err) => {
        })
    },


    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param slot
     */
    shiftClick: (bot, slot) => {
        if (!bot.smart.vars.work) return
        if (!slot) return
        bot.clickWindow(slot, 0, 1).catch((err) => {
        })
    },
    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param slot
     */
    click: (bot, slot) => {
        if (!bot.smart.vars.work) return
        bot.clickWindow(slot, 0, 0).catch((err) => {
        })
    },
    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param slot
     */
    rubish: (bot, slot) => {
        if (!bot.smart.vars.work) return
        if (!slot) return
        bot.clickWindow(slot, 0, 4).catch((err) => {
        })
    },


    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param slot
     * @returns {Promise<void>}
     */
    toLeftHand: (bot, slot) => {

        bot._client.write("window_click", {
            "windowId": bot.currentWindow?.id || 0,
            "slot": slot,
            "mouseButton": 40,
            "action": 2,
            "mode": 2,
            "item": {"present": false}
        })


    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param slot
     * @param item
     *
     *
     */
    checkSlot: (bot, slot, item) => {
        if (!bot.smart.vars.work) return

        return bot?.currentWindow?.slots[slot]?.name === item
    },

    /**
     * Ждет, пока появится нужный слот
     * @param {import('mineflayer').Bot} bot
     * @param slot
     * @param item
     * @param maxWait
     * @returns Promise
     */
    waitToSlot: async (bot, slot, item, maxWait = 5000) => {

        let wait = 0
        while (bot.currentWindow?.slots[slot]?.name !== item) {
            if (wait > maxWait) return false
            await func.delay(10)
            wait += 10
        }
        return true
        //window.click(bot, slot)
    },


    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @returns {Promise<void>}
     */
    close: async (bot) => {
        if (bot.currentWindow) bot.closeWindow(bot.currentWindow)
        while (bot.currentWindow) {
            await func.delay(50)
        }

    },


    /**
     * Ждать до открытия окна с определённым названием
     * @param bot
     * @param name
     * @param maxWait
     * @returns Promise
     */
    waitToNameWindow: async (bot, name, maxWait = 5000) => {
        if (!bot.smart.vars.work) return

        let wait = 0
        while (window.getNameWindow(bot) !== name) {
            if (wait > maxWait) return false
            await func.delay(10)
            wait += 10
        }
        return true
    },


    /**
     * Ждать до изменения названия окна
     * @param bot
     * @param maxWait
     * @returns Promise
     */
    waitToChangeNameWindow: async (bot, maxWait = 5000) => {
        if (!bot.smart.vars.work) return

        const name = window.getNameWindow(bot)
        let wait = 0
        while (window.getNameWindow(bot) === name) {
            if (wait > maxWait) return false
            await func.delay(10)
            wait += 10
        }
        return true
    },


    /**
     * Ждать до изменения колиества слотов
     * @param bot
     * @param maxWait
     * @returns Promise
     */
    waitToChangeCountSlot: async (bot, maxWait = 5000) => {
        if (!bot.smart.vars.work) return

        const countSlot = bot?.currentWindow?.slots?.length
        let wait = 0
        while (countSlot === bot?.currentWindow?.slots?.length) {
            if (wait > maxWait) return false
            await func.delay(10)
            wait += 10
        }
        await func.delay(100)
        return true
    },

    /**
     * Получить название окна
     * @param {import('mineflayer').Bot} bot
     */
    getNameWindow: (bot) => {
        if (!bot.smart.vars.work) return
        return bot.currentWindow?.title?.value?.extra?.value?.value?.map(el => el.text?.value)?.join("")
    },



    swapItem: async (bot, slot1, slot2) => {
        if (!bot.smart.vars.work) return

        if (slot1 === slot2) return
        window.click(bot, slot1)
        await func.delay(200)
        window.click(bot, slot2)
        await func.delay(200)
        window.click(bot, slot1)
        await func.delay(200)


    }
}

export default window