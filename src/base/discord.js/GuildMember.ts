import { ChatInputApplicationCommandData, Guild, GuildMember } from 'discord.js'
import { RawGuildData, RawGuildMemberData } from 'discord.js/typings/rawDataTypes'
import Mono from '@base/Mono'
import { TFunction } from 'i18next'
import { generateOptions } from '@utils/index'
import { GuildModules } from '@typings/index'
import Console from '@utils/console'
import { getTranslatorFunction } from '@utils/localization'
import MonoUser from '@base/discord.js/User'

export default // @ts-ignore
class MonoGuildMember extends GuildMember {
	// public modules: { [x: string]: Module }
	client!: Mono
	user!: MonoUser
	modules!: GuildModules
	modulesRaw!: object

	private customData: any = null

	constructor(client: Mono, data: RawGuildMemberData, guild: Guild) {
		super(client, data, guild)
	}

	public async fetchCustomData() {
		// this.customData
	}

	public async getWarnings(includeDeleted: boolean = false) {
		return await this.client.database.warning.findMany({
			where: {
				guildId: this.guild.id,
				userId: this.user.id,
				...(!includeDeleted && { deleted: false })
			}
		})
	}

	public async addWarning(executorId: string, content?: string) {
		const guildWarnings = await this.client.database.warning.findMany({
			where: {
				guildId: this.guild.id
			},
			orderBy: {
				id: 'desc'
			}
		})
		const lastId = guildWarnings[0]?.id || 0
		await this.client.database.warning.create({
			data: {
				id: lastId + 1,
				guildId: this.guild.id,
				content: content ?? '',
				executorId,
				userId: this.user.id
			}
		})
	}
}
