const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

const view = {
  getCardElement(index) {
    return rawHTML =
      `
    <div class="card back" data-index="${index}">
    </div>
    `
  },

  getCardContent(index){
    const number = this.transformNumber((index + 1) % 13);
    const symbol = Symbols[Math.floor(index / 13)];
    return rawHTML =
    `
    <p class="number">${number}</p>
    <img src=${symbol} alt="" class="suits">
    <p class="number">${number}</p>
    `
  },

  displayCard() {
    const cards = document.querySelector('.cards')
    // const array52 = Array.from(Array(52).keys())
    //Array(52)創造一個長度為52的空陣列，keys()將其轉變為陣列迭代器(或稱可迭代物件)
    //Array.from()以會從類陣列（array-like）或是可迭代（iterable）物件建立一個新的 Array 實體。
    const array52 = utility.getRandomNumberArray(52)
    const arrayHTML = array52.map(index => this.getCardElement(index))
    cards.innerHTML = arrayHTML.join('')
    //join將陣列中所有元素迭代粘貼
  },

  transformNumber(number) {
    switch (number) {
      case 1:
        return "A"
      case 11:
        return "J"
      case 12:
        return "Q"
      case 0:
        return "K"
      default:
        return number
    }
  },

  flipCard(card) {
    console.log(card)
    if (card.classList.contains('back')) {
      // 回傳正面
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(card.dataset.index)
      return
    }
    // 回傳背面
    card.classList.add('back')
    card.innerHTML = null
  }
}

const utility = {
  //Fisher-Yates Shuffle
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      //從陣列最後一位開始往前迭代
      let randomIndex = Math.floor(Math.random() * (index + 1));
      //選出陣列中隨機一位,因Math.floor()[]會被另外解讀，故要加上分號
      [number[index], number[randomIndex]] = [number[randomIndex], number[index]]
      //ES6 的解構賦值語法，意思是讓 number[randomIndex] 和 number[index] 交換
      //let [a,b,c] = [1,2,3]
    }
    return number
  }
}

view.displayCard()

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    view.flipCard(card)
  })
})