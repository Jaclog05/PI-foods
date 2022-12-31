const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('recipe', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summarizeDish: {
      type: DataTypes.STRING,
      notNull: false
    },
    healthScore: {
      type: DataTypes.DECIMAL,
    },
    image: {
      type: DataTypes.STRING
    },
    dishType: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    steps: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    }
  }
  ,
  { timestamps: false });
};
