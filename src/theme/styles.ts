const styles = {
  global: {
    'html, body': {},
    '#nprogress': {
      pointerEvents: 'none'
    },

    '#nprogress .bar': {
      background: 'blue.500',
      position: 'fixed',
      zIndex: '1031',
      top: 0,
      left: 0,
      width: '100%',
      height: '4px'
    }
  }
}

export default styles
