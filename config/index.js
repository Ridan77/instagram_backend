import configProd from './prod.js'
import configDev from './dev.js'


export var config

if (process.env.NODE_ENV === 'production') {
  console.log('Production')
  config = configProd
} else {
  console.log('Dev')
  config = configDev
}
// config.isGuestMode = true


