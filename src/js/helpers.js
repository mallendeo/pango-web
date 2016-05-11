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

// replaces the element text with an array of spans
// and returns it
export const splitTextInSpans = elem => {
  const letters = elem.textContent.split('')
  elem.innerHTML = ''
  return letters.map(letter => {
    const span = document.createElement('span')
    span.textContent = letter
    elem.appendChild(span)
    return span
  })
}
