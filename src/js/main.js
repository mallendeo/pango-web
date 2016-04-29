/* global TimelineMax */

const animateLogo = tl => {
  const maxWindowSize = Math.max(window.innerHeight, window.innerWidth)

  const squareDarkWrapper = document.querySelector('.square-dark-wrapper')
  const squareDark = squareDarkWrapper.querySelector('.square-dark')
  const square = document.querySelector('.square-wrapper')
  const lines = square.querySelectorAll('.line')
  const sparks = document.querySelectorAll('.spark')
  const outerCircle = document.querySelector('.outer-logo-circle .circle')
  const logo = document.querySelector('.pango-logo')

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
    .to(outerCircle, .4, {
      opacity: 0,
      ease: 'Power4.easeOut'
    }, 2.7)
    .to(logo, 1, {
      opacity: 1,
      scale: 1,
      ease: 'Power4.easeOut'
    }, 2.7)

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
      const delay = (1.8 + ((Math.abs(spans.length / 2 - j)) / 20)).toFixed(2)
      tlWords.to(spans[j], 1.4, {
        y: 0,
        opacity: 1,
        ease: 'Expo.easeOut'
      }, delay)
      console.log(j, delay)
    }
  }
  return tl
}

const animateBackground = tl => {
  const section = document.querySelector('.section--intro')
  const createDots = qty => {
    for (let i = 0; i < qty; i++) {
      const dot = document.createElement('div')
      dot.classList.add('dot')
      section.appendChild(dot)
      tl.set(dot, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scaleX: 0
        })
    }
  }

  const animateDots = dots => {
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i]
      const dotSize = 2
      const scaleTo = Math.random() * 20
      const startTime = i / 8
      tl.to(dot, 1, {
          scaleX: 1,
          ease: 'Expo.easeOut'
        }, startTime)
        .to(dot, 2, {
          scaleX: 4 * (1 + scaleTo) + 8,
          ease: 'Expo.easeOut'
        }, startTime + .8)
        .to(dot, 2, {
          scaleX: 0,
          x: '+=' + 4 * (scaleTo + 1) * dotSize,
          ease: 'Expo.easeOut'
        }, startTime + 1.5)
    }
  }

  createDots(10)

  const dots = section.querySelectorAll('.dot')
  animateDots(dots)
}

animateBackground(new TimelineMax({ delay: 1.4, repeat:-1 }))
animateLogo(new TimelineMax())
animateWords(new TimelineMax())
