/* global TimelineMax, TweenMax, Waypoint */
import forEach      from 'lodash.foreach'
import intro        from './intro'
import about        from './about'
import {
  addClass,
  splitTextInSpans
} from './helpers'

const init = () => {
  intro().init()
  intro().animateBackground(new TimelineMax({
    delay: 2.8,
    repeat: -1,
    repeatDelay: 0
  }))
  intro().animateLogo(new TimelineMax())
  intro().animateWords(new TimelineMax())

  about()

  const projects = document.querySelectorAll('[data-project]')
  forEach(projects, project => {
    const slideshow = project.querySelector('[data-slideshow]')
    const slides = slideshow.querySelectorAll('.slide')
    const description = project.querySelector('.description')
    const moreButton = project.querySelector('.button--view-project')

    moreButton.addEventListener('click', () => {
      addClass(description, 'more')
      addClass(moreButton, 'hide')
    })

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
    let waypoint = new Waypoint({
      element: project,
      handler: () => {
        waypoint.destroy()
      }
    })
  })

  const portfolioTitle = () => {
    const portfolioWrapper  = document.querySelector('#portfolio .wrapper')
    const portfolioTextElem = portfolioWrapper.querySelector('h1')
    const spans             = splitTextInSpans(portfolioTextElem)
    const squares           = createSquares()
    const tl                = new TimelineMax()

    function createSquares() {
      const colors = ['#873158', '#A83956', '#C34057', '#E14756', '#292F36']
      return colors.map(color => {
        const square = document.createElement('div')
        addClass(square, 'square-portfolio-animation')
        square.style.background = color
        portfolioWrapper.appendChild(square)
        return square
      })
    }

    function reset() {
      tl.set(spans, { y: 95 })
      tl.set(squares, { x: 0, scaleX: 0 })
    }

    function animate() {

      // animate squares
      forEach(squares, (square, i) => {
        let delay = i / 10
        tl.to(square, 1, {
          scaleX: 1,
          ease: 'Power4.easeInOut'
        }, delay)
        tl.to(square, 1, {
          x: '100%',
          ease: 'Power4.easeInOut'
        }, delay + .2)
      })

      // animate letters
      forEach(spans, (span, i) => {
        tl.to(span, 1, {
          y: 0,
          ease: 'Expo.easeOut'
        }, i / 30 + .4)
      })
    }

    return {
      animate,
      reset
    }
  }

  let portfolioTitleInit = portfolioTitle()
  portfolioTitleInit.reset()

  let waypoint = new Waypoint({
    element: document.querySelector('#portfolio'),
    offset: '40%',
    handler: () => {
      portfolioTitleInit.animate()
      waypoint.destroy()
    }
  })
}

init()
