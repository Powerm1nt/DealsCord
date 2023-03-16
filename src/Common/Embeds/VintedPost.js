const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Events } = require('discord.js')

function generateEmbed (posts, interaction, postIndex) {
  const avatar = interaction.client.user.avatarURL()

  return new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(posts[postIndex].title)
    .setURL(posts[postIndex].url)
    .setAuthor({
      name: posts[postIndex].user.login,
      url: posts[postIndex].user.url
    })
    .setThumbnail(posts[postIndex].user.photo.url)
    .setImage(posts[postIndex].photo.url)
    .addFields(
      { name: 'Price', value: Math.round(posts[postIndex].price * 100) / 100 + '€', inline: false },
      { name: 'Reputation', value: posts[postIndex].favourite_count.toString(), inline: false }
    )
    .setTimestamp()
    .setFooter({ text: interaction.client.user.tag, iconURL: avatar })
  posts[postIndex].size_title >= 1 && embed.addField({
    name: 'Size',
    value: posts[postIndex].size_title,
    inline: false
  })
}

class VintedPost {
  async makePost (interaction, posts) {
    this.interaction = interaction
    this.posts = posts
    this.postIndex = 0
    this.lastPostIndex = this.posts.length - 1

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

    interaction.client.on(Events.InteractionCreate, interaction => {
      if (!interaction.isButton()) return
      if (interaction.customId === 'nextVintedPost') {
        this.postIndex++
        console.log(this.postIndex)
        interaction.update({
          components: [buttons],
          embeds: [generateEmbed(posts, interaction, this.postIndex)]
        })
      }

      if (interaction.customId === 'prevVintedPost') {
        this.postIndex--
        interaction.update({
          components: [buttons],
          embeds: [generateEmbed(posts, interaction, this.postIndex)]
        })
      }
    })

    return await interaction.reply({
      components: [buttons],
      embeds: [generateEmbed(posts, interaction, this.postIndex)]
    })
  }
}

module.exports = { VintedPost }
