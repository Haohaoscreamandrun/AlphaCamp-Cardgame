
const GAME_STATE = {
  FirstCardAwait: "FirstCardAwait",
  SecondCardsAwait: "SecondCardsAwait",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatchSuccess: "CardsMatchSuccess",
  GameFinished: "GameFinished"
}


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

  getCardContent(index) {
    const number = this.transformNumber((index + 1) % 13);
    const symbol = Symbols[Math.floor(index / 13)];
    return rawHTML =
      `
    <p class="number">${number}</p>
    <img src=${symbol} alt="" class="suits">
    <p class="number">${number}</p>
    `
  },

  displayCard(indexes) {
    const cards = document.querySelector('.cards')
    // const array52 = Array.from(Array(52).keys())
    //Array(52)創造一個長度為52的空陣列，keys()將其轉變為陣列迭代器(或稱可迭代物件)
    //Array.from()以會從類陣列（array-like）或是可迭代（iterable）物件建立一個新的 Array 實體。
    // const array52 = utility.getRandomNumberArray(52)
    const arrayHTML = indexes.map(index => this.getCardElement(index))
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

  flipCards(...cards) {
    //...在這裡叫其餘參數，其後的參數會被收集成為一個陣列,有length屬性並可以使用array function。用於不確定會傳入多少參數時。 
    cards.map(card => {
      if (card.classList.contains('back')) {
      // 回傳正面
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(card.dataset.index)
      return
    }
    // 回傳背面
    card.classList.add('back')
    card.innerHTML = null
    })
  },

  pairedCards(...cards) {
    cards.map(card=>{
      card.classList.add('paired')
    })
  },

  renderScore(score) {
    document.querySelector('.score').innerHTML = `Score: ${score}`
  },

  renderTryTimes(times) {
    document.querySelector('.tried').innerHTML = `You've tried ${times} times`
  },

  appendAnimation(...cards){
    cards.map(card=>{
      card.classList.add('wrong')
      //remove class after 1s
      card.addEventListener('animationend', event => {
        card.classList.remove('wrong')
      },{
        once: true
        //remove eventListener after use, or it will hang lots of.
      })
    })
  },

  showGameFinished() {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.tryTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  },

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

const controller = {
  currentState: GAME_STATE.FirstCardAwait,

  generateCards() {
    view.displayCard(utility.getRandomNumberArray(52))
  },

  dispatchCardAction(card) {
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwait:
        view.flipCards(card)
        //傳入單一值，被其餘參數轉變為長度為1的陣列
        model.revealCards.push(card)
        this.currentState = GAME_STATE.SecondCardsAwait;
        break;
      case GAME_STATE.SecondCardsAwait:
        view.flipCards(card)
        model.revealCards.push(card)
        view.renderTryTimes(++model.tryTimes)
        //前置 ++ 是先將變量的值加1，然後使用加1後的值參與運算；而後置 ++ 是先使用該值參與運算，然後再將值加1.
        if (model.isRevealedCardsMatch()) {
          //if match
          view.renderScore(model.score += 10)
          this.currentState = GAME_STATE.CardsMatchSuccess
          view.pairedCards(...model.revealCards)
          //將類陣列用展開運算子展開，進入函釋後又被其餘運算子轉成陣列
          model.revealCards = [];
          if (model.score === 260) {
            console.log('showGameFinished')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()  // 加在這裡
            return
          }
          this.currentState = GAME_STATE.FirstCardAwait
        } else {
          //if not match
          this.currentState = GAME_STATE.CardsMatchFailed
          //run wrong animation
          view.appendAnimation(...model.revealCards)
          //留一點時間給使用者記憶
          setTimeout(this.resetCards, 1000);
          //1000ms equals 1s
          //要計時的是函式本身不是呼叫的結果，不用加()
        };
        break;
    }
  },

  resetCards(){
    view.flipCards(...model.revealCards)
    model.revealCards = [];
    controller.currentState = GAME_STATE.FirstCardAwait;
    //在這裡用this會call到setTimeout
  },
}

const model = {
  revealCards: [],

  isRevealedCardsMatch() {
    return (this.revealCards[0].dataset.index % 13 === this.revealCards[1].dataset.index % 13)
  },

  score: 0,
  tryTimes: 0,
}

controller.generateCards()

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    controller.dispatchCardAction(card)
    console.log(controller.currentState, model.revealCards)
  })
})