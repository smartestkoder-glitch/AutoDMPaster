import func from "../function.js";


const donate = {
    get: (bot) => {
        return bot.smart.vars.donate
    },
    startDetect: (bot) => {
        bot._client.on("teams", (packet) => {
            //func.outputObject(packet)
            const don = packet?.prefix?.value?.extra?.value?.value[3]?.text?.value
            if (!don || packet?.team === 'TAB-Sidebar-4') return
            bot.smart.vars.donate = don

        })
    },

    slots: {
        oldVersion: {
            "Игрок": 3,
            "Барон": 6
        },
        newVersion: {

        }
    }
}


export default donate