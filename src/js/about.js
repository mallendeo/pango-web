/* global TweenMax, Waypoint */
import forEach  from 'lodash.foreach'

const about = () => {
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

  const draw = drawDevices()
  draw.init()

  let waypoint = new Waypoint({
    element: document.querySelector('.section--about'),
    offset: '25%',
    handler: () => {
      drawDevices().draw()
      waypoint.destroy()
    }
  })

  return {
    drawDevices
  }
}

export default about
