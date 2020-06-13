const mysql = require('mysql')
const config = require('../config/config.json')

const pool = mysql.createPool(config.mysql)

module.exports = {
    load: (query) => {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, result, field) => {
                if (error) {
                    return reject(error)
                }
                resolve(result)
            })
        })
    }
}