import Mono from '@base/Mono'
import Console from '@utils/console'
import { Client as BotiCord, DjsAdapter } from 'boticord.js'

export default async function(client: Mono) {
    const adapter = new DjsAdapter(client)
    const boticordClient = new BotiCord({
        token: 'Bot ' + process.env.BOTICORD_TOKEN,
        apiVersion: 2,
    }, adapter)

    // Post statistics to Boticord every 30 minutes
    await postStats(boticordClient, client)
    setInterval(
        async () => await postStats(boticordClient, client), 
        30 * 60 * 1000
    )
}

async function postStats(boticordClient: BotiCord, client: Mono) {
    const result = await boticordClient.bots.postStats({
        servers: client.guilds.cache.size,
        users: client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b),
    })

    if(result) {
        Console.success(`Posted statistics to Boticord`)
    } else {
        Console.error(`Failed to post statistics to Boticord`)
    }
}