import func from "../../Bots utils/function.js"

const autoClanInvest = {



    investIfHave: async (bot) => {
        if (!bot.smart.vars.work) return
        const minMoney = bot.smart.vars.default.minClanInvest
        const money = bot.smart.vars.money.balance

        if (money >= minMoney)  {
            await func.delay(300)
            bot.chat("/clan invest " + minMoney)
            await func.delay(500)
        }
    }

}

export default autoClanInvest