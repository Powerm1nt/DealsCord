const { EmbedBuilder } = require('discord.js')
const {
  pagination,
  ButtonTypes,
  ButtonStyles
} = require('@devraelfreeze/discordjs-pagination')
const { excludeCategory } = require('../Filters')

function generateEmbed (post, interaction) {
  const avatar = interaction && interaction.client.user.avatarURL()
  const rating = post.favourite_count
  // TODO: Change the Evaluation display
  const fullStars = 46
  const halfStars = Math.fround((rating / fullStars) * 5)
  const fullStarEmoji = '⭐'
  const fullStarsString = halfStars <= 1 ? fullStarEmoji : fullStarEmoji.repeat(halfStars)

  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(post.title)
    .setURL(post.url)
    .setAuthor({
      name: post.user.login,
      url: post.user.url
    })

  if (post.user.photo && post.user.photo.url) {
    embed.setThumbnail(post.user.photo.url)
  }

  embed
    .setImage(post.photo.full_size_url)
    .addFields(
      {
        name: '💵 Prix',
        value: Math.round(post.price?.amount * 100) / 100 + ' ' + post.price?.currency_code,
        inline: true
      },
      {
        name: '✨ Evaluation',
        value: `${fullStarsString} (${rating})`,
        inline: true
      },
      {
        name: '📏 Taille',
        value: post.size_title,
        inline: true
      }
    )
    .setTimestamp()
    .setFooter(interaction
      ? {
          text: interaction.client.user.tag,
          iconURL: avatar
        }
      : { text: `Publication Vinted | ID: ${post.id}` })

  embed.addFields({
    name: '🏷️ Marque',
    value: post?.brand_title,
    inline: true
  },
  {
    name: '👤 Vendeur',
    value: `[${post.user.login}](${post.user.profile_url})`,
    inline: true
  },
  {
    name: '📆 Publication',
    // value: Date.from(post.photo.high_resolution.timestamp).toISOString(),
    value: 'N/A',
    inline: true
  }
  )

  return embed
}

class VintedCollections {
  async makePost (interaction, posts) {
    this.arrayEmbeds = []

    posts.forEach((post, _) => {
      excludeCategory(post.url, interaction.excluded_types || 'maison', 'accessoires', 'divertissement') &&
            this.arrayEmbeds.push(generateEmbed(post, interaction))
    })

    if (this.arrayEmbeds.length === 0) {
      await interaction.reply({
        content: '⚠️ Aucun résultat trouvé.',
        ephemeral: true
      })
      return
    }

    await pagination({
      embeds: this.arrayEmbeds,
      author: interaction.member.user,
      interaction,
      ephemeral: true,
      time: 120000,
      pageTravel: false,
      buttons: [
        {
          type: ButtonTypes.previous,
          label: 'Previous Page',
          style: ButtonStyles.Secondary
        },
        {
          type: ButtonTypes.next,
          label: 'Next Page',
          style: ButtonStyles.Success
        },
        {
          type: ButtonTypes.constructor('Test'),
          label: 'Next Page',
          style: ButtonStyles.Success
        }
      ]
    })
  }
}

module.exports = {
  VintedPost: VintedCollections,
  generateEmbed
}
