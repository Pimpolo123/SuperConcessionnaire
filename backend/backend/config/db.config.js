module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "Test123*",
    DB: "postgres",
    dialect: "postgres",
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };