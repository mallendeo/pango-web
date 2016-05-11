/* global TimelineMax, TweenMax */
import forEach      from 'lodash.foreach'
import random       from 'lodash.random'
import raf          from 'raf'
import { addClass } from './helpers'

const intro = () => {
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

      // 3d rotation
      const rotate = (rx, ry) => {
        TweenMax.to(wrapper, .75, {
            rotationX: ry,
            rotationY: rx,
            ease: 'Power0.easenone'
          })
      }

      // update rotation values
      const update = (elem, event, tilt) => {
        if (tilt) {
          const tiltLR = event.gamma
          const tiltFB = event.beta
          rotate(tiltLR / 1.5, tiltFB / 1.5)

          return
        }

        const xpos = event.layerX || event.offsetX
        const ypos = event.layerY || event.offsetY

        const ax = -(window.innerWidth / 2 - xpos) / 40
        const ay = (window.innerHeight / 2 - ypos) / 10
        rotate(ax, ay)
      }

      // get element for mousemove event tracking
      // on top of all other layers
      const trackerLayer = document.querySelector('.mouse-tracker-layer')
      trackerLayer.addEventListener('mousemove', e => raf(() => update(wrapper, e)))

      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', e =>
          raf(() => update(wrapper, e, true)))
      }
    }

    createLines(50)
    animateLines(wrapper.querySelectorAll('.line'))
  }

  return {
    animateLogo,
    animateWords,
    animateBackground
  }
}

export default intro