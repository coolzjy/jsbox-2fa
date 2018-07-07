const { Secret } = require('scripts/otp-auth')

const FILE_PATH = 'data.json'

const file = $file.read(FILE_PATH)

const data = file ? deserializeData(file.string) : []

function serializeData(data) {
  return JSON.stringify(data.map(i => ({
    ...i,
    secret: i.secret.b32
  })))
}

function deserializeData(str) {
  return JSON.parse(str).map(i => ({
    ...i,
    secret: Secret.fromB32(i.secret)
  }))
}

function persistData() {
  $file.write({
    data: $data({
      string: serializeData(data)
    }),
    path: FILE_PATH
  })
}

exports.insert = function (opt) {
  data.push(opt)
  persistData()
}

exports.remove = function (opt) {
  data.splice(data.indexOf(opt), 1)
  persistData()
}

exports.order = function (from, to) {
  data.splice(to, 0, data.splice(from, 1)[0])
  persistData()
}

exports.getDataByIndex = function (index) {
  return data[index]
}

exports.getListData = function () {
  return data.map(i => ({
    issuer: {
      text: i.issuer
    },
    label: {
      text: i.label
    }
  }))
}