import func from "../function.js"
import move from "../move.js"

const autoJump = {

    autoJump: async (bot, kd, status) => {
        if (!bot.smart.vars.work) return

        if (bot.smart.vars.default.autoJump && status === false) bot.smart.vars.default.autoJump = false
        else if (!bot.smart.vars.default.autoJump && status === true) bot.smart.vars.default.autoJump = true
        else return
        while (bot.smart.vars.default.autoJump && bot.smart.vars.work) {
            move.just.jump.start(bot)
            await func.delay(300)
            move.just.jump.stop(bot)

            await func.delay(kd)
        }
    }

}

export default autoJump