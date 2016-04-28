/* global TimelineMax */

const animateLogo = tl => {
  const maxWindowSize = Math.max(window.innerHeight, window.innerWidth)

  const squareDarkWrapper = document.querySelector('.square-dark-wrapper')
  const squareDark = squareDarkWrapper.querySelector('.square-dark')
  const square = document.querySelector('.square')
  const lines = document.querySelectorAll('.line')
  const sparks = document.querySelectorAll('.spark')
  const outerCircle = document.querySelector('.outer-logo-circle circle')

  tl.set(squareDark, {
      height: maxWindowSize,
      width: maxWindowSize
    })
    .set(lines, { scaleX: 0 })

  for (let i = 0; i < lines.length; ++i) {
    tl.to(lines[i], 2, {
      scaleX: 1,
      ease: 'Expo.easeOut'
    }, i / 10)
  }

  tl.to(lines, .05, {
      opacity: 0
    }, 1)
    .to(squareDarkWrapper, 1.5, {
      scale: 1.3,
      ease: 'Expo.easeOut'
    }, 1)
    .to(square, 2, {
      rotationZ: 45,
      ease: 'Expo.easeOut'
    }, 1.5)
    .to(sparks, 1, {
      strokeDashoffset: 0,
      ease: 'Expo.easeOut'
    }, 1.5)
    .to(sparks, 1, {
      strokeDashoffset: 145,
      ease: 'Expo.easeOut'
    }, 1.5)
    .to(outerCircle, 1.4, {
      strokeDashoffset: 0,
      ease: 'Expo.easeInOut'
    }, 1.7)
  return tl
}

const animateWords = tl => {
  const wordsWrapper = document.querySelector('.pango-words')
  const words = wordsWrapper.querySelectorAll('.pango-word')
  const lineSeparator = wordsWrapper.querySelector('.line-separator')

  tl.set(wordsWrapper, { opacity: 0 })
    .set(lineSeparator, { scaleX: 0 })
    .to(wordsWrapper, .2, { opacity: 1 }, 1.8)
    .to(lineSeparator, 1, {
      scaleX: 1,
      ease: 'Expo.easeOut'
    }, 1.8)

  for (let i = 0; i < words.length; ++i) {
    const word = words[i]
    const letters = word.textContent.split('')
    word.innerHTML = ''

    for (let letter of letters) {
      const span = document.createElement('span')
      span.textContent = letter
      word.appendChild(span)
    }

    const spans = word.querySelectorAll('span')
    for (let j = 0; j < spans.length; ++j) {
      let tlWords = new TimelineMax()
      tlWords.set(spans[j], { y: i == 0 ? 40 : 30, opacity: 1 })
      const delay = (1.8 + ((Math.abs(spans.length / 2 - j)) / 10)).toFixed(2)
      tlWords.to(spans[j], 2, {
        y: 0,
        opacity: 1,
        ease: 'Expo.easeOut'
      }, delay)
      console.log(j, delay)
    }
  }
  return tl
}

animateLogo(new TimelineMax())
animateWords(new TimelineMax())
