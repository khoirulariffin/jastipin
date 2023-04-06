"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Transaction, { foreignKey: "UserId" });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "First name is required",
          },
          len: {
            args: [2, 50],
            msg: "First name must be between 2 to 50 characters",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Last name is required",
          },
          len: {
            args: [2, 50],
            msg: "Last name must be between 2 to 50 characters",
          },
        },
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Date of birth is required",
          },
          isDate: {
            msg: "Invalid date format",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email address is already in use",
        },
        validate: {
          notNull: {
            msg: "Email address is required",
          },
          isEmail: {
            msg: "Invalid email format",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required",
          },
          len: {
            args: [6, 50],
            msg: "Password must be between 6 to 50 characters",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
        validate: {
          notNull: {
            msg: "Role is required",
          },
          isIn: {
            args: [["user", "admin"]],
            msg: "Invalid role",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      dateOfBirth: DataTypes.DATE,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
