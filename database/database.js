import sql from 'mssql';


export default class Database {
  config = {};
  poolconnection = null;
  connected = false;

  constructor(config) {
    this.config = config;
    console.log(`Database: config: ${JSON.stringify(config)}`);
  }


  async connect() {
    try {
      console.log(`Database connecting...${this.connected}`);
      if (this.connected === false) {
        this.poolconnection = await sql.connect(this.config);
        this.connected = true;
        console.log('Database connection successful');
      } else {
        console.log('Database already connected');
      }
    } catch (error) {
      console.error(`Error connecting to database: ${JSON.stringify(error)}`);
    }
  }

  async disconnect() {
    try {
      this.poolconnection.close();
      console.log('Database connection closed');
    } catch (error) {
      console.error(`Error closing database connection: ${error}`);
    }
  }

  // Opret en bruger 
  async createUser(user) {
    await this.connect();
    const request = this.poolconnection.request()
      .input('name', sql.NVarChar, user.fullName)
      .input('password', sql.NVarChar, user.password)
      .input('email', sql.NVarChar, user.email)
      .input('age', sql.Int, user.age)
      .input('weight', sql.Int, user.weight)
      .input('gender', sql.NVarChar, user.gender)
    const result = await request.query(`INSERT INTO NutriDB.users (name, password, email, age, weight, gender) VALUES (@name, @password, @email, @age, @weight, @gender)`);
    return result.recordsets[0];
  }

  // bruges til at lave hvad som helst
  async executeQuery(query) {
    await this.connect();
    const request = this.poolconnection.request();
    const result = await request.query(query);

    return result.rowsAffected[0];
  }

  async readAll(tableName) {
    await this.connect();
    const request = this.poolconnection.request();
    const result = await request.query(`SELECT * FROM ` + tableName);
    // console.log(result.recordsets);
    return result.recordsets[0];
  }

  async getUserByMail(email) {
    await this.connect();
    const request = this.poolconnection.request();
    const result = await request
    .input('email', sql.NVarChar,email)
    .query(`SELECT * FROM NutriDB.users WHERE email = @email`)
    return result.recordset[0];
  }

  async readIdFromTable(id, tableName) {
    await this.connect();

    const request = this.poolconnection.request();
    const result = await request
      .input('id', sql.Int, +id)
      .input('tableName', sql.Str, +tableName)
      .query(`SELECT * FROM @tableName WHERE id = @id`);

    return result.recordset[0];
  }

  // async update(id, data) {
  //   await this.connect();

  //   const request = this.poolconnection.request();

  //   request.input('id', sql.Int, +id);
  //   request.input('firstName', sql.NVarChar(255), data.firstName);
  //   request.input('lastName', sql.NVarChar(255), data.lastName);

  //   const result = await request.query(
  //     `UPDATE Person SET firstName=@firstName, lastName=@lastName WHERE id = @id`
  //   );

  //   return result.rowsAffected[0];
  // }

  async deleteWithId(id, tableName) {
    await this.connect();

    const idAsNumber = Number(id);

    const request = this.poolconnection.request();
    const result = await request
      .input('id', sql.Int, idAsNumber)
      .query(`DELETE FROM Person WHERE id = @id`);
    //indsæt mere

    return result.rowsAffected[0];
  }


}