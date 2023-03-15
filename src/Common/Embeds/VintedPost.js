const { EmbedBuilder } = require('discord.js')

async function makePost (interaction, id, title, description, price, image, link) {
  const avatar = interaction.client.user.avatarURL()

  return await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Some title')
        .setURL('https://discord.js.org/')
        .setAuthor({
          name: 'Some name',
          iconURL: 'https://i.imgur.com/AfFp7pu.png',
          url: 'https://discord.js.org'
        })
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
          { name: 'Regular field title', value: 'Some value here' },
          { name: '\u200B', value: '\u200B' },
          { name: 'Inline field title', value: 'Some value here', inline: true },
          { name: 'Inline field title', value: 'Some value here', inline: true }
        )
        .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter({ text: interaction.client.user.tag, iconURL: avatar })
    ]
  })
}

module.exports = { createPost: makePost }
