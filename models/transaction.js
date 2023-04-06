'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Product, { foreignKey: 'ProductId' })
      this.belongsTo(models.User, { foreignKey: 'UserId' })
      // define association here
    }
  }
  Transaction.init({
    quantity: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};