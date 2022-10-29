import { Command } from '@base/Command'
import CommandContext from '@base/CommandContext'
import MonoGuild from '@base/discord.js/Guild'
import { MonoEmbed, SuccessEmbed } from '@base/Embed'
import { MonoCommand } from '@typings/index'
import { CommandOptionTypes } from '../../enums'
import emojis from '../../assets/emojis'

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
					type: CommandOptionTypes.SUB_COMMAND,
					options: [
						{
							id: 'time',
							type: CommandOptionTypes.STRING,
							required: true,
							choices: [
								{
									id: 'day',
									value: 'day'
								},
								{
									id: 'night',
									value: 'night'
								}
							]
						},
                        {
                            id: 'image-url',
                            type: CommandOptionTypes.STRING,
                            required: true
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
		})
    }

	async execute({ interaction, t }: CommandContext, { subCommand, subCommandGroup, ...options }: CommandOptions) {
        if(subCommand === 'daytime') {
            const { hour, minute } = options
            await this.guild.modules.dayNight.setDaytime(hour!, minute ?? 0)
            await interaction.reply({
                embeds: [new SuccessEmbed(t('daytimeChanged'))]
            })
        }

        if(subCommand === 'nighttime') {
            const { hour, minute } = options
            await this.guild.modules.dayNight.setNighttime(hour!, minute ?? 0)
            await interaction.reply({
                embeds: [new SuccessEmbed(t('nighttimeChanged'))]
            })
        }

        if(subCommand === 'icon') {
            const { time, imageUrl } = options
            if(time === 'day') {
                await this.guild.modules.dayNight.setDaytimeGuildIconUrl(imageUrl!)
                await interaction.reply({
                    embeds: [new SuccessEmbed(t('daytimeIconChanged'))]
                })
            } else {
                await this.guild.modules.dayNight.setNighttimeGuildIconUrl(imageUrl!)
                await interaction.reply({
                    embeds: [new SuccessEmbed(t('nighttimeIconChanged'))]
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
	subCommand: 'daytime' | 'nighttime' | 'icon' | 'set' | 'remove',
    subCommandGroup?: 'channel',
    hour?: number,
    minute?: number,
    time?: 'day' | 'night',
    imageUrl?: string,
    channel?: string,
    dayName?: string,
    nightName?: string
}