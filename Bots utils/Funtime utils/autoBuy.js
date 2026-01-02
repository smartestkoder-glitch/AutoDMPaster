import func from '../function.js';
import window from '../window.js';

import autoBuySettings from "../../Bots settings/autoBuy settings.js";
import {it} from "node:test";
import restart from "./restart.js";
import moneyFT from "./moneyFT.js";
import inventory from "../inventory.js";
import antiAFK from "./antiAFK.js";

const autoBuy = {
    /**
     *
     * @param item
     */
    getLoreJSON: (item) => {
        const lore = item?.components?.find(el => el?.type === "custom_data")?.data?.value?.display?.value?.Lore?.value?.value?.join(",")
        if (!lore) return []
        return JSON.parse("["+ lore + "]")
    },

    getPrice: (item)=> {
        const data = autoBuy.getLoreJSON(item)
        if (!data) return
        return Number(data?.find(el => Array.isArray(el?.extra) && el?.extra[0]?.text === "$")?.extra[2]?.text?.replace(/\D/g, ""))
    },

    getDealer: (item) => {
        const data = autoBuy.getLoreJSON(item)

        if (!data) return
        return data.find(el => Array.isArray(el?.extra) && (el.extra.length > 1) && (el?.extra[1]?.text?.includes("Прoдaвeц")))?.extra[2]?.text?.replaceAll(" ", "")
    },

    getTypePotion: (item) => {
        return item?.components?.find(el => el?.type === "custom_data")?.data?.value?.Potion?.value
    },

    decodeOneItem: (item) => {
        if (!item) return
        return {
            count: item.count,
            name: item.name,
            dealer: autoBuy.getDealer(item),
            price: autoBuy.getPrice(item),
            potion: autoBuy.getTypePotion(item),
            slot: item.slot
        }
    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     */
    decodeAll: (bot) => {
        let result = []

        if (!bot.currentWindow?.slots) return []

        for (const item of bot.currentWindow?.slots) {
            const dec = autoBuy.decodeOneItem(item)
            if (!dec) continue
            if (isNaN(dec.price)) continue
            result.push(dec)
        }
        return result
    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param par
     * @param randLook
     * @returns {Promise<void>}
     */
    openAh: async (bot, par, randLook = true) => {
        await window.close(bot)
        if (randLook) await antiAFK.randomLook(bot)
        for (let i = 0; i < 3; i++) {
            bot.chat("/ah " + par)
            if (await window.waitToChangeCountSlot(bot, 5000)) {
                await func.delay(1500)
                return
            }
        }
        restart.default(bot, "Не открылся аукцион")
    },


    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param normPrice
     * @param name
     * @param potion
     */
    findNormalOffer: (bot, normPrice, name, potion) => {
        const decodeAh = autoBuy.decodeAll(bot)
        const money = moneyFT.getMoney(bot)

        const normOffer = decodeAh.find(item => item.name === name && item.potion === potion && (item.price/item.count) < normPrice && item.price < money)

        return normOffer

    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     */
    getListNow: (bot) => {
        const nameWindow = window.getNameWindow(bot)

        return nameWindow?.match(/Поиск: Инв \[\d+\//)?.[0]?.replace(/\D/g, "")
    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     */
    getListAll: (bot) => {
        const nameWindow = window.getNameWindow(bot)

        return nameWindow?.match(/\/\d+/)?.[0]?.replace(/\D/g, "")
    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param slot
     * @returns {Promise<void>}
     */
    buyItem: async (bot, slot) => {
        window.click(bot, slot)
        if (!await window.waitToSlot(bot, 1, "lime_stained_glass_pane", 5000)) return

        window.click(bot, 1)
        await window.waitToChangeCountSlot(bot, 5000)
    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     */
    goNextPage: async (bot) => {

        if (autoBuy.checkLastPage(bot)) return

        window.click(bot, 50)
        await window.waitToChangeNameWindow(bot, 5000)
    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     */
    checkLastPage: (bot) => {
        if (bot.currentWindow?.slots[50]) return false
        return true
    },

    /**
     * Проверяет, открыто окно аукциона или нет
     * @param {import('mineflayer').Bot} bot
     */
    checkAh: (bot) => {
        if (bot.currentWindow?.slots[49]?.name === "nether_star") return true
        return false
    },

    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param itemName
     * @param price
     * @param potion
     * @param minBuyCount
     * @param minNeedCount
     * @param timeToBuy
     * @param timeToNextPage
     * @param minMoneyCount
     * @returns {Promise<string>}
     */
    multiPageAutoBuy: async (bot, itemName, price, potion, minBuyCount = 1, minNeedCount = 1, timeToBuy = 1000, timeToNextPage = 1000, minMoneyCount = 10) => {
        if (!bot.currentWindow) return "окно закрыто"
        if (!autoBuy.checkAh(bot)) return "окно не аук"




        while (!autoBuy.checkLastPage(bot) // Проверяет, что не на последней странице
        && inventory.getCountItem(bot.currentWindow?.slots, itemName, 54, 90) < minNeedCount // Проверяет, выполнил ли цель по покупке предметов
        && moneyFT.getMoney(bot) >= (price * minMoneyCount)) { // Проверяет, что достаточно монет для покупки X предметов



            const normOffer = autoBuy.findNormalOffer(bot, price, itemName, potion)

            if (normOffer) {
                await func.delay(timeToBuy)
                await autoBuy.buyItem(bot, normOffer.slot)
            }
            await func.delay(timeToNextPage)

            await autoBuy.goNextPage(bot)



        }

    }
}


export default  autoBuy