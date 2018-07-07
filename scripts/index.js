const {
  parseURI,
  generate
} = require('scripts/otp')
const {
  insert,
  remove,
  order,
  getDataByIndex,
  getListData
} = require('scripts/store')

let list

const creatItem = _ => $qrcode.scan(url => {
  const opt = parseURI(url)
  if (!opt) return
  $ui.alert({
    title: generate(opt),
    message: $l10n('success')
  })
  insert(opt)
  list.data = getListData()
})

module.exports = function () {
  $ui.render({
    type: 'view',
    views: [
      {
        type: 'list',
        layout: $layout.fill,
        props: {
          id: 'list',
          reorder: true,
          header: {
            type: 'view',
            props: {
              height: 50
            },
            views: [
              {
                type: 'button',
                layout(make) {
                  make.edges.inset(5)
                },
                props: {
                  title: $l10n('create')
                },
                events: {
                  tapped: creatItem
                }
              }
            ]
          },
          template: {
            type: 'view',
            views: [
              {
                type: 'view',
                layout(make) {
                  make.top.bottom.left.inset(5)
                },
                props: {
                  radius: 4,
                  bgcolor: $rgba(0, 0, 0, 0.2)
                },
                views: [
                  {
                    type: 'label',
                    layout(make, view) {
                      make.right.left.inset(10)
                      make.centerY.equalTo(view.super.centerY)
                    },
                    props: {
                      id: 'issuer'
                    }
                  }
                ]
              },
              {
                type: 'label',
                layout(make, view) {
                  make.left.equalTo($('issuer').super.right).offset(10)
                  make.centerY.equalTo(view.super.centerY)
                },
                props: {
                  id: 'label'
                }
              }
            ]
          },
          actions: [
            {
              title: $l10n('remove'),
              color: $color('red'),
              handler(_, indexPath) {
                const opt = getDataByIndex(indexPath.row)
                $ui.alert({
                  title: $l10n('confirm_title'),
                  message: opt.label,
                  actions: [
                    {
                      title: $l10n('confirm'),
                      handler() {
                        remove(opt)
                        list.data = getListData()
                      }
                    },
                    {
                      title: $l10n('cancel')
                    }
                  ]
                })
              }
            }
          ]
        },
        events: {
          didSelect(_, indexPath) {
            const opt = getDataByIndex(indexPath.row)
            $ui.alert(generate(opt))
          },
          reorderMoved(from, to) {
            order(from.row, to.row)
          }
        }
      }
    ]
  })

  list = $('list')
  list.data = getListData()
}
