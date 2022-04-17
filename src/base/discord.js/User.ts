import { ChatInputApplicationCommandData, Guild, GuildMember, User } from 'discord.js'
import { RawGuildData, RawGuildMemberData, RawUserData } from 'discord.js/typings/rawDataTypes'
import Mono from '@base/Mono'
import { TFunction } from 'i18next'
import { generateOptions } from '@utils/index'
import { GuildModules } from '@typings/index'
import Console from '@utils/console'
import { getTranslatorFunction } from '@utils/localization'

export default // @ts-ignore
class MonoUser extends User {
	client!: Mono

	// private customData: any = null

	constructor(client: Mono, data: RawUserData) {
		super(client, data)
	}

	public async fetchCustomData() {
		// this.customData
	}

	public get isStaff() {
		return this.client.config.staffIds.includes(this.id)
	}
}
