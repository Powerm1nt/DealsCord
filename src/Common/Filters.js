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

function excludeCategory (url, ...categories) {
  // Convert the URL to lowercase for case-insensitive comparison
  const lowerCaseUrl = url.toLowerCase()

  // Iterate through each word in the category and check if it's included in the URL
  for (const category of categories[0]) {
    for (const word of category) {
      if (lowerCaseUrl.includes(word.toLowerCase())) {
        return false
      }
    }
  }

  return true
}

// Example:
// const value = excludeCategory('https://www.vinted.fr/vetements/?search_text=jeans&price_from=0&price_to=100&reputation=1&order=price_asc&page=1&brand_id[]=1&size=XS', categories.accessoires, categories.divertissement, categories.maison)
// console.log(value)

module.exports = {
  categories,
  excludeCategory
}
