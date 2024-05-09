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
      .input('metabolism', sql.Int, user.metabolism)
    const result = await request.query(`INSERT INTO NutriDB.users (name, password, email, age, weight, gender, metabolism) VALUES (@name, @password, @email, @age, @weight, @gender, @metabolism)`);
    return result.recordsets[0];
  }

  // Søgning af ingredienser (lav input felt og tilddel det variablen searchTerm)
  async searchIngredients(searchTerm) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('searchTerm', sql.NVarChar, `%${searchTerm}%`)
        .query(`SELECT * FROM NutriDB.ingredient WHERE foodName LIKE @searchTerm`);
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved søgning efter ingredienser:', error);
      throw error;
    }
  }


  // Finder informationer om ét måltid som en unik bruger har oprettet via userID og mealID
  async getMealIngredients(userID, mealID) {
    try {
      await sql.connect(config);

      const result = await sql.query`
        SELECT MI.*, M.*, I.*
        FROM NutriDB.mealIngredient AS MI
        JOIN NutriDB.meal AS M ON MI.mealID = M.mealID
        JOIN NutriDB.ingredient AS I ON MI.IngredientID = I.ingredientID
        WHERE M.userID = ${userID} AND M.mealID = ${mealID}
      `;

      return result.recordset;
    } catch (error) {
      console.error('Fejl ved hentning af måltidsingredienser:', error);
      throw error;
    } finally {
      sql.close();
    }
  }

  // Finder alle oprettede måltider på baggrund af et userID og samler tabellerne meal, mealingredient og ingredients for at få et overblik over måltiderne
  async getAllUserMeals(userID) {
    try {
      await sql.connect(config);

      const result = await sql.query`
          SELECT M.*, MI.*, I.*
          FROM NutriDB.meal AS M
          JOIN NutriDB.mealIngredient AS MI ON M.mealID = MI.mealID
          JOIN NutriDB.ingredient AS I ON MI.IngredientID = I.ingredientID
          WHERE M.userID = ${userID}
        `;

      return result.recordset;
    } catch (error) {
      console.error('Fejl ved hentning af brugerens måltider:', error);
      throw error;
    } finally {
      sql.close();
    }
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 1: Indsætter et måltid via Meal Creator (Denne er todelt, da den først skal oprette måltidsnavnet og derefter ingredienser)
  async postIntoDbMeal(name, userID, mealType) {
    try {
      await sql.connect(config);
      const result = await sql.query`
    INSERT INTO [NutriDB].[meal] (name, userID, mealType)
    VALUES (${name}, ${userID}, ${mealType})`;

      return result.recordset;
    } catch (error) {
      console.error('Fejl ved indsætning af brugerens måltidsnavn i [NutriDB].[meal]:', error);
      throw error;
    } finally {
      sql.close();
    }
  }

  // 2: Indsætter de ingredienser et måltid består af (bemærk at ernæringsværdierne skal være udregnet før de lægges herind). 
  // mealID kommer fra [NutriDB].[meal] og fungerer som fremmednøgle her
  async postIntoDbMealIngredient(mealID, ingredientID, quantity, cEnergyKj, cProtein, cFat, cFiber, cEnergyKcal, cWater, cDrymatter) {
    try {
      await sql.connect(config);
      const result = await sql.query`
    INSERT INTO [NutriDB].[mealIngredient] (mealID, ingredientID, quantity, cEnergyKj, cProtein, cFat, cFiber, cEnergyKcal, cWater, cDrymatter)
    VALUES (${mealID}, ${ingredientID}, ${quantity}, ${cEnergyKj}, ${cProtein}, ${cFat}, ${cFiber}, ${cEnergyKcal}, ${cWater}, ${cDrymatter})`;
      // Bemærk at denne kode kun vil indsætte én ingrediens. Måske kan man lave en løkke der kører funktionen indtil alle ingredienser er kørt igennem??? 
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved indsætning af brugerens ingredienser i [NutriDB].[mealIngredient]:', error);
      throw error;
    } finally {
      sql.close();
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Indsætning af måltid i mealtracker 
  async postIntoDbMealTracker(mealID, userID, date, quantity) {
    try {
      await sql.connect(config);
      const result = await sql.query`
    INSERT INTO [NutriDB].[mealTracker] (mealID, userID, date, quantity)
    VALUES (${mealID}, ${userID}, ${date}, ${quantity})`;

      return result.recordset;
    } catch (error) {
      console.error('Fejl ved indsætning af brugerens måltid tracker i [NutriDB].[mealTracker]:', error);
      throw error;
    } finally {
      sql.close();
    }
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
      .input('email', sql.NVarChar, email)
      .query(`SELECT * FROM NutriDB.users WHERE email = @email`)
    return result.recordset[0];
  }

  async searchFoodItems(searchTerm) {
    await this.connect();
    const request = this.poolConnection.request();
    const result = await request
      .input('searchTerm', sql.NVarChar, `%${searchTerm}%`)
      .query(`SELECT * FROM NutriDB.food_items WHERE foodName LIKE @searchTerm`);
    return result.recordset;
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

  async updateUser(email, age, weight, gender, metabolism) {
    await this.connect(); // Ensure there is a database connection
    try {
      // Use the existing connection
      // Prepare SQL query with parameters for updating user details
      const request = this.poolconnection.request()
        .input('email', sql.NVarChar, email)
        .input('age', sql.Int, age)
        .input('weight', sql.Decimal, weight)
        .input('gender', sql.NVarChar, gender)
        .input('metabolism', sql.Int, metabolism)
      const result = await request.query(`UPDATE NutriDB.users SET age = @age, weight = @weight, gender = @gender, metabolism = @metabolism WHERE email = @email`);

      if (result.rowsAffected[0] > 0) {
        return { success: true, message: 'User updated successfully' };
      } else {
        return { success: false, message: 'No user found with the given email' };
      }
    } catch (err) {
      console.error('Failed to update user:', err);
      throw new Error('Database operation failed');
    }
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


  async deleteUserId(id) {
    try {
      await this.connect(); // Ensure there's error handling within this function.

      const idAsNumber = Number(id);
      if (isNaN(idAsNumber)) {
        throw new Error("Invalid ID provided");
      }

      const request = this.poolconnection.request();
      const result = await request
        .input('id', sql.Int, idAsNumber)
        .query(`DELETE FROM NutriDB.users WHERE UserId = @id`);

      return result.rowsAffected[0];
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error; // rethrow or handle error appropriately
    }
  }


}
