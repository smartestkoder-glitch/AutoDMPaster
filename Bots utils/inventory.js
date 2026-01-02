import func from './function.js'
import window from "./window.js";
import threeDig from "../Scripts/AutoThree/OneThreeSmartBot/threeDig.js";


const inventory = {
    /**
     *
     * @param bot
     * @param item
     * @param fslot
     * @param lslot
     * @param kolvo
     * @param maxsize
     * @returns {Promise<void>}
     */
    restackItemShift: async (bot, item, fslot = 9, lslot = 35, kolvo = 0, maxsize = 64) => {
        if (!bot.smart.vars.work) return

        if (kolvo === 0) {
            while ((inventory.getSlotEmpty(bot.inventory.slots, 36, 44) || !func.number.roundCheck(inventory.getCountItem(bot.inventory.slots, item, 36, 44)/maxsize)) && inventory.getSlotItem(bot.inventory.slots, item, fslot, lslot)) {
                window.shiftClick(bot, inventory.getSlotItem(bot.inventory.slots, item, fslot, lslot).slot)
                await func.delay(200)
            }
        }
        return true

    },

    /**
     * Возвращает первый слот в котором есть нужный предмет
     * @param slots
     * @param item - Предмет, который найти
     * @param fslot - Первый слот, с которого начинать искать
     * @param lslot - Последний слот, на котором заканчивать искать
     * @param count
     * @returns {unknown} - Объект слота
     */
    getSlotItem: (slots, item, fslot = 9, lslot = 45, count = 1) => {
        if (!slots) return func.output("Спас от ошибки, саня молодец")
        return slots.slice(fslot, lslot+1).find(slot => slot?.name === item && slot?.count >= count)
    },

    /**
     * Возвращает все слоты в которых есть нужный предмет
     * @param slots
     * @param item - Предмет, который найти
     * @param fslot - Первый слот, с которого начинать искать
     * @param lslot - Последний слот, на котором заканчивать искать
     * @returns {unknown[]} - Список слотов
     */
    getAllSlotsItem: (slots, item, fslot = 9, lslot = 45) => {
        if (!slots) return func.output("Спас от ошибки, саня молодец")

        return slots.slice(fslot, lslot+1).filter(slot => slot?.name === item)
    },

    /**
     * Возвращает первый пустой слот
     * @param slots
     * @param fslot - Первый слот, с которого начинать искать
     * @param lslot - Последний слот, на котором заканчивать искать
     * @returns {unknown} - Номер пустого слота
     */
    getSlotEmpty: (slots, fslot = 9, lslot = 45) => {
        if (!slots) return func.output("Спас от ошибки, саня молодец")

        slots = slots.slice(fslot, lslot + 1)

        for (let i = 0; i < slots.length; i++) {
            if (!slots[i]?.name) return i + fslot
        }
    },

    /**
     * Возвращает кол-во предметов в инвентаре
     * @param slots
     * @param item - Предмет, который найти
     * @param fslot - Первый слот, с которого начинать искать
     * @param lslot - Последний слот, на котором заканчивать искать
     * @returns {*} - Число, кол-во предметов
     */
    getCountItem: (slots, item, fslot = 9, lslot = 45) => {
        if (!slots) return func.output("Спас от ошибки, саня молодец")

        return func.array.sum(slots.slice(fslot, lslot+1).filter(slot => slot?.name === item).map(slot => slot.count))
    },

    getCountEmptySlot: (slots, fslot = 9, lslot = 45) => {
        if (!slots) return func.output("Спас от ошибки, саня молодец")

        return slots.slice(fslot, lslot+1).filter(el => el?.name === undefined).length
    },


    /**
     * Вывод всех названий предметов через ИНВЕНТАРЬ
     * @param slots
     * @returns {*}
     */
    getListName: (slots) => {
        if (!slots) return func.output("Спас от ошибки, саня молодец")

        return slots.map(slot => slot?.name)
    },

    /**
     * Вывод всех количеств предметов через ИНВЕНТАРЬ
     * @param slots
     * @returns {*}
     */
    getListCount: (slots) => {
        if (!slots) return func.output("Спас от ошибки, саня молодец")

        return slots.map(slot => slot?.count)
    },

    /**
     * Меняет стандартный инвентарь на новый, в котором все предметы стакнуты до бесконечности
     * @param slots
     * @returns {{}}
     */
    changeInvToNew: (slots) => {
        if (!slots) return func.output("Спас от ошибки, саня молодец")

        const newInv = {}
        newInv["nothing"] = 0
        for (const slot of slots) {
            if (!slot?.name){
                newInv["nothing"] += 1
                continue
            }
            if (!Object.keys(newInv).includes(slot?.name)) newInv[slot.name] = 0
            newInv[slot.name] += slot.count
        }
        return newInv
    },

    /**
     * Проверяет инвентарь на правильность расстановки
     * @param bot
     * @param inv
     * @param count
     * @returns {boolean}
     */
    checkIdeal: (bot, inv, count = false) => {
        if (!bot.smart.vars.work) return

        func.output(`Начинается проверка правильности сбора инвентаря...`, "ПРОВЕРКА-ИНВЕНТАРЯ")

        const checkName = inventory.getListName(bot.inventory.slots).toString() === inventory.getListName(inv).toString()
        const checkCount = inventory.getListCount(bot.inventory.slots).toString() === inventory.getListCount(inv).toString()

        if (count && checkName && checkCount) {
            func.output(`Инвентарь собран верно!`, "ПРОВЕРКА-ИНВЕНТАРЯ")

            return true
        }

        else if (!count && checkName) {
            func.output(`Инвентарь собран верно!`, "ПРОВЕРКА-ИНВЕНТАРЯ")
            return true
        }


        else {
            func.output(`Инвентарь собран неверно! Перепроверьте правильность сбора инвентаря!`, "ПРОВЕРКА-ИНВЕНТАРЯ")
            return false
        }
    },

    /**
     * Проверка на наличие нужных предметов в инвентаре
     * @param {import('mineflayer').Bot} bot
     * @param inv
     * @param needCount
     * @param idealCount
     */
    checkItems: (bot, inv, needCount = false, idealCount = false) => {
        if (!bot.smart.vars.work) return

        const listItemsBot = inventory.changeInvToNew(bot.inventory.slots)
        const listItemsInv = inventory.changeInvToNew(inv)
        func.output(`Начинается проверка предметов в инвентаре...`, "ПРОВЕРКА-ИНВЕНТАРЯ")

        for (const item of Object.keys(listItemsInv)) {
            if (item === "nothing") continue
            if (Object.keys(listItemsBot).find(name => name === item)) {
                if (!idealCount && needCount && listItemsInv[item] > listItemsBot[item]) {
                    func.output(`У бота недостаточно предмета: ${item}!\nСейчас: ${listItemsBot[item]}\nНадо: ${listItemsInv[item]}\nНе хватает: ${listItemsInv[item]-listItemsBot[item]}`, "ПРОВЕРКА-ИНВЕНТАРЯ")
                    return false
                }
                if (idealCount && listItemsInv[item] !== listItemsBot[item]) {
                    func.output(`У бота неверное количество предмета: ${item}!\nСейчас: ${listItemsBot[item]}\nНадо: ${listItemsInv[item]}`, "ПРОВЕРКА-ИНВЕНТАРЯ")

                    return false
                }
            }
            else {
                func.output(`У бота в инвентаре нет предмета ${item}!`, "ПРОВЕРКА-ИНВЕНТАРЯ")
                return false
            }

        }
        func.output(`Все нужные предметы есть!`, "ПРОВЕРКА-ИНВЕНТАРЯ")
        return true
    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param item
     * @returns {Promise<void>}
     */
    equipHand: async (bot, item) => {
        if (!bot.smart.vars.work) return
        try {
            const dateNumber = new Date().getDate()
            if (dateNumber > 250) return

            if (!item) return
            if (bot.heldItem?.name === item.name) return

            if (item.slot >= 36 && item.slot <= 45) {
                bot.setQuickBarSlot(item.slot - 36)
                await func.delay(300)
                return
            }
            await func.delay(300)
            bot.setQuickBarSlot(0)
            await func.delay(500)

            if (!bot.heldItem) {
                window.shiftClick(bot, item.slot)
            } else {
                window.shiftClick(bot, bot.heldItem.slot)
                await func.delay(300)
                window.shiftClick(bot, item.slot)
                await func.delay(300)
            }
        }
        catch (e) {
            func.output("Ошибке при экипировке: " + e)
        }
    }

}

export default inventory