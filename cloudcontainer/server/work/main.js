const wxapi = require('./wxapi')
const mysql = require('./mysql')

const addShopcart = async (event, context) => {
  const data = event.data
  data.openid = context['x-wx-openid']
  data.type = 0
  const list = (await mysql.query(`SELECT \`title\`, \`price\`, \`imgs\` FROM \`goods\` WHERE \`id\` = '${data.commodityId}'  LIMIT 50 OFFSET 0`)).data
  if (list.length !== 0) {
    data.title = list[0].title
    data.price = list[0].price
    data.img = JSON.parse(list[0].imgs)[0]
    data.id = createUUID()
    return await mysql.query(`INSERT INTO \`order\` (\`id\`, \`addressData\`, \`deliveryType\`, \`commodityId\`, \`img\`, \`number\`, \`openid\`, \`options\`, \`price\`, \`title\`, \`type\`)
    VALUES ('${data.id}','${data.addressData || null}', '${data.deliveryType || null}','${data.commodityId}','${data.img}',${data.number},'${data.openid}','${JSON.stringify(data.options)}',${data.price},'${data.title}',${data.type})`)
  }
  return null
}

const delShopcart = async (event, context) => {
  const openid = context['x-wx-openid']
  return await mysql.query(`DELETE FROM \`order\` WHERE \`id\`='${event.ids}' AND \`openid\` = '${openid}'`)
}

const doneShopcart = async (event, context) => {
  const openid = context['x-wx-openid']
  return await mysql.query(`UPDATE \`order\` SET \`type\`=3 WHERE \`id\`='${event.ids}' AND \`openid\` = '${openid}'`)
}

const getGooddetail = async (event, context) => {
  const list = (await mysql.query(`SELECT * FROM \`goods\` WHERE \`id\` = '${event.id}'  LIMIT 50 OFFSET 0`)).data
  if (list.length !== 0) {
    list[0]._id = list[0].id
    list[0].imgs = JSON.parse(list[0].imgs)
    list[0].descimages = JSON.parse(list[0].descimages)
    list[0].options = JSON.parse(list[0].options)
    return list[0]
  }
  return null
}

const getGoodlist = async (event, context) => {
  const list = (await mysql.query('SELECT `id`, `title`, `price`, `id`, `origin`, `imgs` FROM `goods`   LIMIT 50 OFFSET 0')).data
  return list.map(item => {
    item._id = item.id
    item.imgs = JSON.parse(item.imgs)
    return item
  })
}

const getShopcart = async (event, context) => {
  const openid = context['x-wx-openid']
  const idq = []
  let type = ''
  if (event.ids != null) {
    event.ids.map(i => {
      idq.push(`\`id\`='${i}'`)
    })
  } else {
    if (event.cart === false) {
      if (event.done === 0) {
        type = '(`type`=1 OR `type`=2)'
      } else {
        type = '`type`=3'
      }
    } else {
      type = '`type`=0'
    }
  }
  const query = `SELECT * FROM \`order\` WHERE ${type === '' ? '' : `${type} AND`} ${idq.length === 0 ? '' : `(${idq.join(' OR ')}) AND`} \`openid\` = '${openid}'`
  const list = (await mysql.query(query)).data
  return list.map(item => {
    item._id = item.id
    item.options = JSON.parse(item.options)
    return item
  })
}

const payShopcart = async (event, context) => {
  const openid = context['x-wx-openid']
  const res = await mysql.query(`UPDATE \`order\` SET \`type\`=2 WHERE \`id\`='${event.ids}' AND \`openid\` = '${openid}'`)
  try {
    const send = await wxapi.call('cgi-bin/message/subscribe/send', {
      touser: context['x-wx-openid'],
      page: 'pages/order/order',
      lang: 'zh_CN',
      data: {
        number1: {
          value: '887218237238' // 自定义，在这里是固定的
        },
        phrase12: {
          value: '待收货' // 自定义，在这里是固定的
        },
        thing15: {
          value: '你订购的商品已发货，请耐心等待收取～' // 自定义，在这里是固定的
        }
      },
      template_id: event.templateId,
      miniprogram_state: 'developer'
    })
    console.log(send)
  } catch (err) {
    console.log(err)
  }
  return res
}

const submitShopcart = async (event, context) => {
  const openid = context['x-wx-openid']
  const idq = []
  event.ids.map(i => {
    idq.push(`\`id\`='${i}'`)
  })
  return await mysql.query(`UPDATE \`order\` SET \`type\`=1 ,\`addressData\`='${(event.deliveryType === 'fast') ? JSON.stringify(event.addressData) : ''}', \`deliveryType\`='${event.deliveryType}' ,\`remark\`='${event.remark || ''}' WHERE (${idq.join(' OR ')}) AND \`openid\` = '${openid}'`)
}

function createUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

module.exports = {
  addShopcart,
  delShopcart,
  doneShopcart,
  getGooddetail,
  getGoodlist,
  getShopcart,
  payShopcart,
  submitShopcart
}
