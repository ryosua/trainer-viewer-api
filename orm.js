const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URI)

module.exports = sequelize
