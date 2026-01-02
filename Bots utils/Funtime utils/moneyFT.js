


const moneyFT = {
    moneyUpdateEvent: (bot) => {
        bot._client.on("teams", (packet) => {
            const money = Number(packet?.prefix?.value?.extra?.value?.value[4]?.text?.value?.replace(/\D/g, ""))

            if (!money) return
            bot.smart.vars.money.balance = money

        })
    },
    getMoney: (bot) => {
        return bot.smart.vars.money.balance
    }
}


export default moneyFT