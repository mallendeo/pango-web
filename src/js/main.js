/* global TimelineMax */
const squareDarkWrapper = document.querySelector('.square-dark-wrapper')
const squareDark = squareDarkWrapper.querySelector('.square-dark')
const square = document.querySelector('.square')
const lines = document.querySelectorAll('.line')
const sparks = document.querySelectorAll('.spark')

let maxWindowSize = Math.max(window.innerHeight, window.innerWidth)

const tl = new TimelineMax()

tl.set(squareDark, {
    height: maxWindowSize,
    width: maxWindowSize
  })
  .set(lines, { scaleX: 0 })

for (let i = 0; i < lines.length; i++) {
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
