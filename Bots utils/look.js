

const look = {

    /**
     *
     * @param {import('mineflayer').Bot} bot
     * @param yaw
     * @param pitch
     */
    look: (bot, yaw, pitch) => {
        bot._client.write("look", {
            "yaw":yaw,
            "pitch":pitch,
            "flags":{"_value":1,"onGround":true,"hasHorizontalCollision":false}})
    }

}


export default look