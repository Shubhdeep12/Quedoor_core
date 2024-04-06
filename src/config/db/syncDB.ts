import postgresConnection from "./sequelize";

async function syncDB() {
  try {
    await postgresConnection.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}

export default syncDB;