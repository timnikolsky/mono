import { Command } from '@base/Command'
import CommandContext from '@base/CommandContext'
import MonoGuild from '@base/discord.js/Guild'
import { ErrorEmbed, SuccessEmbed } from '@base/Embed'
import { MonoCommand } from '@typings/index'
import { CommandOptionTypes } from '../../enums'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'daynight',
			options: [
				{
					id: 'daytime',
					type: CommandOptionTypes.SUB_COMMAND,
					options: [
						{
							id: 'hour',
							type: CommandOptionTypes.INTEGER,
							required: true,
                            minValue: 0,
                            maxValue: 23
						},
                        {
                            id: 'minute',
                            type: CommandOptionTypes.INTEGER,
                            required: false,
                            minValue: 0,
                            maxValue: 59
                        }
					]
				},
				{
					id: 'nighttime',
					type: CommandOptionTypes.SUB_COMMAND,
					options: [
						{
							id: 'hour',
							type: CommandOptionTypes.INTEGER,
							required: true,
                            minValue: 0,
                            maxValue: 23
						},
                        {
                            id: 'minute',
                            type: CommandOptionTypes.INTEGER,
                            required: false,
                            minValue: 0,
                            maxValue: 59
                        }
					]
				},
				{
					id: 'icon',
					type: CommandOptionTypes.SUB_COMMAND_GROUP,
					options: [
                        {
                            id: 'set',
                            type: CommandOptionTypes.SUB_COMMAND,
                            options: [{
                                id: 'day-image-url',
                                type: CommandOptionTypes.STRING,
                                required: true
                            }, {
                                id: 'night-image-url',
                                type: CommandOptionTypes.STRING,
                                required: true
                            }]
                        },
						{
							id: 'remove',
							type: CommandOptionTypes.SUB_COMMAND
						}
					]
				},
                {
                    id: 'channel',
                    type: CommandOptionTypes.SUB_COMMAND_GROUP,
                    options: [
                        {
                            id: 'set',
                            type: CommandOptionTypes.SUB_COMMAND,
                            options: [
                                {
                                    id: 'channel',
                                    type: CommandOptionTypes.CHANNEL,
                                    required: true
                                },
                                {
                                    id: 'day-name',
                                    type: CommandOptionTypes.STRING,
                                    required: true
                                },
                                {
                                    id: 'night-name',
                                    type: CommandOptionTypes.STRING,
                                    required: true
                                }
                            ]
                        },
                        {
                            id: 'remove',
                            type: CommandOptionTypes.SUB_COMMAND,
                            options: [
                                {
                                    id: 'channel',
                                    type: CommandOptionTypes.CHANNEL,
                                    required: true
                                }
                            ]
                        }
                    ]
                }
			]
		}),
        this.module = 'dayNight'
    }

	async execute({ interaction, t }: CommandContext, { subCommand, subCommandGroup, ...options }: CommandOptions) {
        if(subCommand === 'daytime') {
            const { hour, minute } = options
            await this.guild.modules.dayNight.setDaytime(hour!, minute ?? 0)
            await interaction.reply({
                embeds: [new SuccessEmbed(t('daytimeChanged'))]
            })
            return
        }

        if(subCommand === 'nighttime') {
            const { hour, minute } = options
            await this.guild.modules.dayNight.setNighttime(hour!, minute ?? 0)
            await interaction.reply({
                embeds: [new SuccessEmbed(t('nighttimeChanged'))]
            })
            return
        }

        if(subCommandGroup === 'icon') {
            if(subCommand === 'set') {
                const { dayImageUrl, nightImageUrl } = options

                // image url regex
                const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/

                if(!urlRegex.test(dayImageUrl!) || !urlRegex.test(nightImageUrl!)) {
                    await interaction.reply({
                        embeds: [new ErrorEmbed(t('invalidImageUrl'))]
                    })
                    return
                }

                await this.guild.modules.dayNight.setGuildIconsUrls(dayImageUrl!, nightImageUrl!)

                await interaction.reply({
                    embeds: [new SuccessEmbed(t('dayNightIconsChanged'))]
                })
                
                return
            }

            if(subCommand === 'remove') {
                await this.guild.modules.dayNight.setGuildIconsUrls(null, null)

                await interaction.reply({
                    embeds: [new SuccessEmbed(t('dayNightIconsRemoved'))]
                })
            }
        }

        if(subCommandGroup === 'channel') {
            if(subCommand === 'set') {
                const { channel, dayName, nightName } = options
                await this.guild.modules.dayNight.setChannelNames(channel!, dayName!, nightName!)
                await interaction.reply({
                    embeds: [new SuccessEmbed(t('channelSet'))]
                })
            }

            if(subCommand === 'remove') {
                const { channel } = options
                await this.guild.modules.dayNight.setChannelNames(channel!, null, null)
                await interaction.reply({
                    embeds: [new SuccessEmbed(t('channelRemoved'))]
                })
            }
        }
	}
}

interface CommandOptions {
	subCommand: 'daytime' | 'nighttime' | 'set' | 'remove',
    subCommandGroup?: 'channel' | 'icon',
    hour?: number,
    minute?: number,
    time?: 'day' | 'night',
    dayImageUrl?: string,
    nightImageUrl?: string,
    channel?: string,
    dayName?: string,
    nightName?: string
}