const mysql = require('mysql')
const config = require('../db.json')
let pool = null
let flag = false

init()

function init () {
  const { ALL_IN_ONE_TDSQL_ADDRESS, ALL_IN_ONE_TDSQL_USERNAME, ALL_IN_ONE_TDSQL_PASSWORD } = process.env
  if (ALL_IN_ONE_TDSQL_ADDRESS != null) {
    pool = mysql.createPool({
      connectionLimit: 100,
      host: ALL_IN_ONE_TDSQL_ADDRESS.split(':')[0],
      user: ALL_IN_ONE_TDSQL_USERNAME,
      password: ALL_IN_ONE_TDSQL_PASSWORD,
      port: ALL_IN_ONE_TDSQL_ADDRESS.split(':')[1],
      database: 'shop'
    })
    flag = true
  } else {
    if (config.host != null && config.host !== '') {
      pool = mysql.createPool({
        connectionLimit: 100,
        host: config.host,
        user: config.user,
        password: config.password,
        port: config.port,
        database: 'shop'
      })
      flag = true
    } else {
      console.log('数据库没有配置正确，无法链接')
    }
  }
}

function query (sql, param = '') {
  if (!flag) return -1
  return new Promise((resolve, reject) => {
    const res = {}
    pool.getConnection(function (err, connection) {
      if (err) {
        res.err = err
        console.log(err)
        resolve(res)
      } else {
        connection.query(sql, param, (err, result) => {
          if (err) res.err = err
          else res.data = result
          connection.release()
          resolve(res)
        })
      }
    })
  })
}

module.exports = {
  query
}
