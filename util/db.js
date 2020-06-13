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
    },
    add: function (table, entity) {
        return new Promise(function (resolve, reject) {
            const sql = `insert into ${table} set ?`;
            pool.query(sql, entity, function (error, results) {
                if (error) {
                    return reject(error);
                }

                resolve(results);
            });
        });
    },
    patch: function (table, entity, condition) {
        return new Promise(function (resolve, reject) {
            const sql = `update ${table} set ? where ?`;
            pool.query(sql, [entity, condition], function (error, results) {
                if (error) {
                    return reject(error);
                }

                resolve(results);
            });
        });
    },
    del: function (table, condition) {
        return new Promise(function (resolve, reject) {
            const sql = `delete from ${table} where ?`;
            pool.query(sql, condition, function (error, results) {
                if (error) {
                    return reject(error);
                }

                resolve(results);
            });
        });
    }
}