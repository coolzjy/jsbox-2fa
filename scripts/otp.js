const {
  URI,
  TOTP
} = require('scripts/otp-auth')

exports.parseURI = function (url) {
  try {
    return URI.parse(url)
  } catch (error) {
    $ui.alert($l10n('invalid_qrcode'))
  }
}

exports.generate = function (opt) {
  return TOTP.generate(opt)
}