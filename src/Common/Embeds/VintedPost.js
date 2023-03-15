const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Events } = require('discord.js')

async function makePost (interaction, posts) {
  const postIndex = 0
  const lastPostIndex = posts.length - 1
  const avatar = interaction.client.user.avatarURL()
  const buttons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('prevVintedPost')
        .setLabel('Prev')
        .setStyle('Secondary'),

      new ButtonBuilder()
        .setCustomId('nextVintedPost')
        .setLabel('Next')
        .setStyle('Primary')
    )

  console.log(posts[0])

  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('title')
    .setURL('https://discord.js.org/')
    .setAuthor({
      name: 'Some name',
      iconURL: 'https://i.imgur.com/AfFp7pu.png',
      url: 'https://discord.js.org'
    })
    .setDescription('description')
  // .setThumbnail('image')
  // .setImage('https://i.imgur.com/AfFp7pu.png')
    .setTimestamp()
    .setFooter({ text: interaction.client.user.tag, iconURL: avatar })

  interaction.client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isButton()) return
    if (interaction.customId === 'nextVintedPost') {
      interaction.update({
        components: [buttons],
        embeds: [embed]
      })
    }

    if (interaction.customId === 'prevVintedPost') {
      interaction.update({
        components: [buttons],
        embeds: [embed]
      })
    }
  })

  return await interaction.reply({
    components: [buttons],
    embeds: [embed]
  })
}

module.exports = { createPostCollection: makePost }
