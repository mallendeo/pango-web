/* global TimelineMax, TweenMax */
import forEach from 'lodash.foreach'
import intro   from './intro'
import about   from './about'

about()
intro().animateBackground(new TimelineMax({
  delay: 2.8,
  repeat: -1,
  repeatDelay: 0
}))
intro().animateLogo(new TimelineMax())
intro().animateWords(new TimelineMax())

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
