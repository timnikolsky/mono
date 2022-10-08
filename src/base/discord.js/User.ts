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
		if(process.env.NODE_ENV !== 'production') {
			return this.client.config.staffIds.includes(this.id)
		} else {
			const monoLoungeGuild = this.client.guilds.cache.get(this.client.config.monoLoungeGuildId)
			if(!monoLoungeGuild) {
				Console.error('Couldn\'t find Mono Lounge guild while checking if user is a staff.')
				return false
			}

			const member = monoLoungeGuild.members.cache.get(this.id)
			if(
				!member
				// Check if user has a staff role
				|| !member.roles.cache.some((role) => this.client.config.staffRolesIds.includes(role.id))
			) {
				return false
			}
		}
	}
}
