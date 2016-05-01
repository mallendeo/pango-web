/* global TimelineMax, TweenMax */
import random  from 'lodash.random'
import forEach from 'lodash.foreach'
import raf     from 'raf'

const addClass = (el, className) => {
  el.classList ? el.classList.add(className) : el.className += ' ' + className
}

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

  forEach(lines, (line, i) => {
    tl.to(lines[i], 2, {
      scaleX: 1,
      ease: 'Expo.easeOut'
    }, i / 10)
  })

  tl.to(lines, .05, {
      opacity: 0
    }, 1)
    .to(squareDarkWrapper, 1.5, {
      scale: 1.4,
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
  const wordsWrapper  = document.querySelector('.pango-words')
  const words         = wordsWrapper.querySelectorAll('.pango-word')
  const lineSeparator = wordsWrapper.querySelector('.line-separator')

  tl.set(wordsWrapper, { opacity: 0 })
    .set(lineSeparator, { scaleX: 0 })
    .to(wordsWrapper, .2, { opacity: 1 }, 1.8)
    .to(lineSeparator, 1, {
      scaleX: 1,
      ease: 'Expo.easeOut'
    }, 1.8)

  forEach(words, (word, i) => {
    const letters = word.textContent.split('')
    word.innerHTML = ''

    for (let letter of letters) {
      const span = document.createElement('span')
      span.textContent = letter
      word.appendChild(span)
    }

    const spans = word.querySelectorAll('span')
    forEach(spans, (span, j) => {
      let tlWords = new TimelineMax()
      tlWords.set(span, { y: i == 0 ? 40 : 30, opacity: 1 })
      const delay = (1.8 + ((Math.abs(spans.length / 2 - j)) / 20)).toFixed(2)
      tlWords.to(span, 1.4, {
        y: 0,
        opacity: 1,
        ease: 'Expo.easeOut'
      }, delay)
    })
  })
  return tl
}

const animateBackground = tl => {
  const wrapper = document.querySelector('.bg-lines-wrapper')
  const createLines = qty => {
    for (let i = 0; i < qty; i++) {
      const line = document.createElement('div')
      addClass(line, 'line')
      wrapper.appendChild(line)
      tl.set(line, {
          x: random(window.innerWidth),
          y: random(window.innerHeight),
          z: random(-200, 200),
          width: random(0, 100) + 50,
          scaleX: 0
        })
    }
  }

  const animateLines = lines => {
    for (let line of lines) {
      const startTime = random(5, true)
      tl.to(line, .4, {
          scaleX: 1,
          ease: 'Expo.Power4'
        }, startTime)
        .to(line, 2, {
          scaleX: 0,
          x: '+=' + line.style.width,
          ease: 'Power4.easeOut'
        }, startTime + .4)
    }

    // mousemove 3d effect
    const update = (elem, event) => {
      const xpos = event.layerX || event.offsetX
      const ypos = event.layerY || event.offsetY

      const ax = -(window.innerWidth / 2 - xpos) / 40
      const ay = (window.innerHeight / 2 - ypos) / 10

      TweenMax.to(wrapper, .75, {
          rotationX: ay,
          rotationY: ax,
          ease: 'Power0.easenone'
        })
    }

    // get element for mousemove event tracking
    // on top of all other layers
    const trackerLayer = document.querySelector('.mouse-tracker-layer')
    trackerLayer.addEventListener('mousemove', e => raf(() => update(wrapper, e)))
  }

  createLines(50)
  animateLines(wrapper.querySelectorAll('.line'))
}

const slideshow = () => {
  let slideshows = document.querySelectorAll('[data-slideshow]')
  forEach(slideshows, slideshow => {
    let slides = slideshow.querySelectorAll('.slide')
    let tl = new TimelineMax({ repeat: -1 })
    TweenMax.set(slides, { opacity: 0 })
    forEach(slides, slide => {
      tl.to(slide, 1, {
          opacity: 1,
          delay: -1
        })
        .to(slide, 1, {
          opacity: 0,
          delay: 4
        })
    })
  })
}

slideshow()

const drawDevices = () => {
  const devices = document.querySelectorAll('.devices .device')

  const init = () => {
    draw(false)
  }

  const draw = (draw = true) => {
    forEach(devices, (device, i) => {
      const paths = device.querySelectorAll('svg path')
      const name = device.querySelector('h4')
      TweenMax.set(name, { opacity: 0 })

      forEach(paths, path => {
        const strokeLength = path.getAttribute('stroke-dasharray')
        TweenMax.set(path, {
          strokeDashoffset: -strokeLength,
          opacity: 0
        })

        if (!draw) return
        const delay = i / 2
        TweenMax.to(path, 4, {
          strokeDashoffset: 0,
          ease: 'Power4.easeOut',
          opacity: 1,
          delay: delay
        })
        TweenMax.to(path, 4, {
          fill: '#f0f0f0',
          ease: 'Power4.easeOut',
          delay: delay + 3
        })
        TweenMax.to(name, 4, {
          opacity: 1,
          ease: 'Power4.easeOut',
          delay: delay + 3
        })
      })
    })
  }

  return {
    draw,
    init,
    triggered: false
  }
}

// Get absolute element position
// gotten from here http://bit.ly/1X0FZaC
const cumulativeOffset = elem => {
  let top = 0
  let left = 0
  do {
    top += elem.offsetTop  || 0
    left += elem.offsetLeft || 0
    elem = elem.offsetParent
  } while(elem)

  return { top, left }
}

const trigger = document.querySelector('.section--about')
const draw = drawDevices()
draw.init()
let triggerOffset = cumulativeOffset(trigger).top
document.addEventListener('scroll', () => {
  raf(() => {
    console.log(document.body.scrollTop, triggerOffset)
    if (!draw.triggered && document.body.scrollTop > triggerOffset) {
      drawDevices().draw()
      draw.triggered = true
    }
  })
})

animateBackground(new TimelineMax({
  delay: 2.8,
  repeat: -1,
  repeatDelay: 0
}))
animateLogo(new TimelineMax())
animateWords(new TimelineMax())
