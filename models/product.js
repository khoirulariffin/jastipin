"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Category, { foreignKey: "CategoryId" });
      this.hasMany(models.Transaction, { foreignKey: "ProductId" });

      // define association here
    }
    static searchProducts(query) {
      let whereClause = {};
      if (query) {
        whereClause.name = { [Op.like]: `%${query}%` };
      }
      return this.findAll({ where: whereClause });
    }
  }
  Product.init(
    {
      productName: DataTypes.STRING,
      price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
      CategoryId: DataTypes.INTEGER,
      country: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
