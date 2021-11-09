const {alias} = require('react-app-rewire-alias');

module.exports = function override(config) {
  alias({
    '@components': 'src/components',
    '@css' : 'src/assets/css',
    '@utils' : 'src/utils',
    '@assets' : 'src/assets',
    '@views' : 'src/views',
    '@services' : 'src/services'
  })(config)

  return config
}