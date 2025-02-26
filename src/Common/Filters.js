const categories = {
  hommes: [
    'Men',
    'Hommes',
    'Hombres',
    'Männer',
    'Uomini',
    'Homens',
    'Мужчины',
    '男士',
    '男性',
    '남자'
  ],
  femmes: [
    'Women',
    'Femmes',
    'Mujeres',
    'Frauen',
    'Donne',
    'Mulheres',
    'Женщины',
    '女士',
    '女性',
    '여자'
  ],
  parfums: [
    'Perfumes',
    'Parfums',
    'Perfumes',
    'Parfums',
    'Profumi',
    'Perfumes',
    'Духи',
    '香水',
    '香水',
    '향수'
  ],
  accessoires: [
    'Accessories',
    'Accessoires',
    'Accesorios',
    'Accessoires',
    'Accessori',
    'Acessórios',
    'Аксессуары',
    '配件',
    'アクセサリー',
    '액세서리'
  ],
  maison: [
    'House',
    'Maison',
    'Casa',
    'Huis',
    'Casa',
    'Casa',
    'Дом',
    '房子',
    '家',
    '집'
  ],
  divertissement: [
    'Entertainment',
    'Divertissement',
    'Entretenimiento',
    'Vermaak',
    'Intrattenimento',
    'Entretenimento',
    'Развлечение',
    '娱乐',
    'エンターテイメント',
    '엔터테인먼트'
  ]
}

const validKeys = Object.keys(categories)

function excludeCategory (url, ...category) {
  for (const cat of category) {
    // Convert the value and the URL to lowercase for case-insensitive comparison
    const lowerCaseUrl = url.toLowerCase()
    const values = categories[cat]

    // if (categories[cat] === undefined || !validKeys.includes(cat)) {
    //   console.error(`Invalid category: ${cat}, ignoring.`)
    //   return true
    // }

    // Iterate through each word in the category and check if it's included in the URL
    for (const cat of values) {
      if (lowerCaseUrl.includes(cat.toLowerCase())) {
        return false
      }
    }
  }

  return true
}

// Example:
// const value = excludeCategory('https://www.vinted.fr/vetements/?search_text=jeans&price_from=0&price_to=100&reputation=1&order=price_asc&page=1&brand_id[]=1&size=XS', 'maison', 'divertissement')
// console.log(value)

module.exports = {
  categories,
  excludeCategory
}
