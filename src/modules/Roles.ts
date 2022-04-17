import Module from '../base/Module'
import { Snowflake } from 'discord.js'
import MonoGuild from '@base/discord.js/Guild'

export default class RolesModule extends Module {
	id = 'roles'

	roleId: Snowflake | null

	constructor(guild: MonoGuild, config: any = {}) {
		super(guild, {
			enabledDefault: true
		})

		this.enabled = config.enabled ?? this.enabledDefault

		this.roleId = config.roleId || null
	}

	async setRoleId(roleId: Snowflake | null) {
		await this.modify({ roleId })
		this.roleId = roleId
	}

	exportConfig(): object {
		return {
			roleId: this.roleId
		}
	}
}
