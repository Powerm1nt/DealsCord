import vinted from '@powerm1nt/vinted-api'
vinted.fetchCookie()
   .then((data) => {
      console.log(data)
      vinted.search('https://www.vinted.fr/vetements?search_text=pokemon?page=2').then((data) => {
         console.log(data)
      })
   })
