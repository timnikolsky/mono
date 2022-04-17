import Listener from '@base/Listener'
import Mono from '@base/Mono'
import MonoGuild from '@base/discord.js/Guild'
import { TextChannel } from 'discord.js'
import Console from '@utils/console'
import { Embed, InfoEmbed } from '@base/Embed'
import { getTranslatorFunction } from '@utils/localization'

export default new Listener(
	'guildCreate',
	async (client: Mono, guild: MonoGuild) => {
		// Add Guild to database
		client.database.guild.create({
			data: {
				id: guild.id,
				reactionRoleMessages: {}
			}
		})
		await guild.fetchCustomData()

		if(guild.preferredLocale === 'ru') {
			await guild.setLanguage('ru')
		} else {
			await guild.setLanguage('en')
		}

		// Warmly greet new guild's users

		const t = getTranslatorFunction(guild.language)
		const greetingChannel = <TextChannel> guild.systemChannel || guild.channels.cache.find(channel => channel.permissionsFor(guild.me!).has('SEND_MESSAGES') && channel.isText())
		if(greetingChannel?.permissionsFor(guild.me!).has('SEND_MESSAGES')) {
			await greetingChannel.send({
				embeds: [
					new Embed()
						.setTitle(t('common:greeting.title'))
						.setDescription(t('common:greeting.description', {
							monoLoungeLink: client.config.monoLoungeInviteLink
						}))
						.setThumbnail(client.user!.avatarURL({ size: 1024 }) ?? '')
				]
			})
		}

		Console.event(`Mono was added to guild '${guild.name}' (${guild.id})`)

		await ((await client.channels.fetch(process.env.MONO_LOGS_CHANNEL!)) as TextChannel).send({
			embeds: [
				new Embed()
					.setTitle('Guild added')
					.addField('Name', guild.name, true)
					.addField('Owner', (await client.users.fetch(guild.ownerId)).tag, true)
					.addField('Members', guild.memberCount.toString(), true)
					.addField('Id', '`' + guild.id + '`')
					.setColor('#43B581')
			]
		})

		if(!await guild.uploadCommands()) {
			if(greetingChannel?.permissionsFor(guild.me!).has('SEND_MESSAGES')) {
				await greetingChannel.send({
					embeds: [
						new InfoEmbed(t('common:noSlashCommandScope'))
					]
				})
			}
		}
	}
)
