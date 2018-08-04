import { encrypt } from '../lib/secure';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      isUnique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordDigest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValue('passwordDigest', encrypt(value));
        this.setDataValue('password', value);
        return value;
      },
      validate: {
        len: [1, +Infinity],
      },
    },
  });

  // Class Method
  User.associate = function (models) {
    models.user.hasMany(models.task, { foreignKey: 'creatorId' } );
    models.user.hasMany(models.task, { foreignKey: 'assignedToId' } );
  };

  // Instance Method
  User.prototype.fullName = function () {
    return `${this.firstName} ${this.lastName}`;
  };

  return User;
};
