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

const validKeys = Object.keys(categories)

function excludeCategory (url, ...category) {
  for (const cat of category) {
    // Convert the URL to lowercase for case-insensitive comparison
    const lowerCaseUrl = url.toLowerCase()
    if (categories[cat] === undefined) throw new Error('Category is invalid')
    const values = categories[cat]
    // Iterate through each word in the category and check if it's included in the URL
    for (const cat of values) {
      for (const word of cat) {
        if (lowerCaseUrl.includes(word.toLowerCase())) {
          return false
        }
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
