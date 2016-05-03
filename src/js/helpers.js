import raf from 'raf'

export const addClass = (el, className) => {
  el.classList ? el.classList.add(className) : el.className += ' ' + className
}

// Get absolute element position
// gotten from here http://bit.ly/1X0FZaC
export const cumulativeOffset = elem => {
  let top = 0
  let left = 0
  do {
    top += elem.offsetTop || 0
    left += elem.offsetLeft || 0
    elem = elem.offsetParent
  } while(elem)

  return { top, left }
}

export const scrollTrigger = (elem, triggered, callback) => {
  const trigger = document.querySelector(elem)
  let triggerOffset = cumulativeOffset(trigger).top

  document.addEventListener('scroll', () => {
    raf(() => {
      const top = (document.documentElement && document.documentElement.scrollTop)
        || document.body.scrollTop

      if (!triggered && top > triggerOffset) {
        callback()
      }
    })
  })
}
