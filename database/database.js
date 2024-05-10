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

  // Funktion til at søge efter måltider. searchTerm og UserID er dynamiske
  async searchMeals(searchTerm, userID) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('searchTerm', sql.NVarChar, `%${searchTerm}%`)
        .input('userID', sql.Int, userID)
        .query('SELECT * FROM NutriDB.meal WHERE userID = 42 AND name LIKE @searchTerm;');
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved søgning efter måltider:', error);
      throw error;
    }
  };

  // Finder alle oprettede måltider på baggrund af et userID og samler tabellerne meal, mealingredient og ingredients for at få et overblik over måltiderne
  async getAllUserMeal(userID) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      console.log(`Attempting to fetch meals for userID: ${userID}`);
      const result = await request

        .query(`
        SELECT * FROM [NutriDB].[meal]
        JOIN [NutriDB].[mealTracker] ON [NutriDB].[meal].mealID = [NutriDB].[mealTracker].mealID
        WHERE [NutriDB].[meal].userID = 42`);

      return result.recordset;
    } catch (error) {
      console.error('Fejl ved hentning af brugerens måltider:', error);
      throw error;
    }
  }



  // Finder informationer om ét måltid som en unik bruger har oprettet via userID og mealID
  async getMealIngredients(userID, mealID) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      console.log(`Attempting to fetch meals for userID: ${userID}`);
      const result = await request
        .query(
          `SELECT MI.*, M.*, I.*
        FROM NutriDB.mealIngredient AS MI
        JOIN NutriDB.meal AS M ON MI.mealID = M.mealID
        JOIN NutriDB.ingredient AS I ON MI.IngredientID = I.ingredientID
        WHERE M.userID = ${userID} AND M.mealID = ${mealID}
      `);

      return result.recordset;
    } catch (error) {
      console.error('Fejl ved hentning af måltidsingredienser:', error);
      throw error;
    } finally {
      sql.close();
    }
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 1: Indsætter et måltid via Meal Creator (Denne er todelt, da den først skal oprette måltidsnavnet og derefter ingredienser)
  async postIntoDbMeal(name, userID, mealType, source) {
    try {
      // Assuming `sql` has been previously configured with connection settings
      await this.connect();
      const request = this.poolconnection.request();

      // Properly add inputs to avoid SQL injection
      request.input('name', sql.NVarChar, name);
      request.input('UserID', sql.Int, userID);
      request.input('mealType', sql.NVarChar, mealType);
      request.input('source', sql.NVarChar, source);

      // Use parameters in your query instead of template literals
      const result = await request.query(`INSERT INTO [NutriDB].[meal] (name, userID, mealType, source) OUTPUT INSERTED.mealID VALUES (@name, @UserID, @mealType, @source)`);

      // Assuming you want to return some information about the operation, for example, the number of affected rows
      return result.recordset[0].mealID;
    } catch (error) {
      console.error('Fejl:', error);
      throw error;

    }
  }


  // 2: Indsætter de ingredienser et måltid består af (bemærk at ernæringsværdierne skal være udregnet før de lægges herind). 
  // mealID kommer fra [NutriDB].[meal] og fungerer som fremmednøgle her
  async postIntoDbMealIngredient(mealID, ingredientID, quantity, cEnergyKj, cProtein, cFat, cFiber, cEnergyKcal, cWater, cDryMatter) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('mealID', sql.Int, mealID)
        .input('ingredientID', sql.Int, ingredientID)
        .input('quantity', sql.Int, quantity)
        .input('cEnergyKj', sql.Int, cEnergyKj)
        .input('cProtein', sql.Int, cProtein)
        .input('cFat', sql.Int, cFat)
        .input('cFiber', sql.Int, cFiber)
        .input('cEnergyKcal', sql.Int, cEnergyKcal)
        .input('cWater', sql.Int, cWater)
        .input('cDryMatter', sql.Int, cDryMatter)
        .query(' INSERT INTO [NutriDB].[mealIngredient] (mealID, ingredientID, quantity, cEnergyKj, cProtein, cFat, cFiber, cEnergyKcal, cWater, cDrymatter) VALUES (@mealID, @ingredientID, @quantity, @cEnergyKj, @cProtein, @cFat, @cFiber, @cEnergyKcal, @cWater, @cDrymatter)')
      // Bemærk at denne kode kun vil indsætte én ingrediens. Måske kan man lave en løkke der kører funktionen indtil alle ingredienser er kørt igennem??? 
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved indsætning af brugerens ingredienser i [NutriDB].[mealIngredient]:', error);
      throw error;
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

  async postCmacroMeal(mealID, tEnergyKj, tProtein, tFat, tFiber, tEnergyKcal, tWater, tDryMatter) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('mealID', sql.Int, mealID)
        .input('tEnergyKj', sql.Int, tEnergyKj)
        .input('tProtein', sql.Int, tProtein)
        .input('tFat', sql.Int, tFat)
        .input('tFiber', sql.Int, tFiber)
        .input('tEnergyKcal', sql.Int, tEnergyKcal)
        .input('tWater', sql.Int, tWater)
        .input('tDryMatter', sql.Int, tDryMatter)
        .query(' INSERT INTO [NutriDB].[totalNutrientsForCreateMeal] (mealID, tEnergyKj, tProtein, tFat, tFiber, tEnergyKcal, tWater, tDryMatter) VALUES (@mealID, @tEnergyKj, @tProtein, @tFat, @tFiber, @tEnergyKcal, @tWater, @tDryMatter)')
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved indsætning af måltidets totale ernæringsindhold i [NutriDB].[totalNutrientsForCreateMeal]:', error);
      throw error;
    }
  }

  async getAllUserRecipes(userID) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('userID', sql.Int, userID)
        .query('SELECT M.*, MI.*, TN.*, I.foodName FROM NutriDB.meal AS M JOIN NutriDB.mealIngredient AS MI ON M.mealID = MI.mealID JOIN NutriDB.ingredient AS I ON MI.ingredientID = I.ingredientID LEFT JOIN NutriDB.totalNutrientsForCreateMeal AS TN ON M.mealID = TN.mealID WHERE M.userID = @userID;')

      return result.recordset;
    } catch (error) {
      console.error('Fejl ved hentning af brugerens måltider:', error);
      throw error;
    }
  }


  // Finder alle meals der er oprettet i mealTracker
  async getTrackedMeals(userID) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request.query
        ('SELECT M.*, MT.* FROM NutriDB.meal AS M JOIN NutriDB.mealTracker AS MT ON M.mealID = MT.mealID WHERE M.userID = @userID', {
          userID: userID
        });
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved hentning af brugerens måltider:', error);
      throw error;
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
        .query(`DELETE FROM [NutriDB].[activityTracker]
        WHERE userID = @id;
        
        DELETE FROM [NutriDB].[mealTracker]
        WHERE userID = @id;
        
        DELETE FROM [NutriDB].[mealIngredient]
        WHERE mealID IN (SELECT mealID FROM [NutriDB].[meal] WHERE userID = @id);
        
        DELETE FROM [NutriDB].[totalNutrientsForCreateMeal]
        WHERE mealID IN (SELECT mealID FROM [NutriDB].[meal] WHERE userID = @id);
        
        DELETE FROM [NutriDB].[meal]
        WHERE userID = @id;
        
        DELETE FROM [NutriDB].[users]
        WHERE userID = @id;`);

      return result.rowsAffected[0];
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error; // rethrow or handle error appropriately
    }
  }
  // Sletter et måltid i både meal og mealIngredient (der skal bruges mealID og UserID for at slette. Bemærk begin og commit transaction gør, at hvis én af disse slettefunktioner slår fejl, vil den ikke slette noget (for at sikre at alt er relationelt))
  async deleteMeal(mealID, userID) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('userID', sql.Int, userID)
        .input('mealID', sql.Int, mealID)
        .query('BEGIN TRANSACTION DELETE FROM [NutriDB].[mealIngredient] WHERE mealID = @mealID DELETE FROM [NutriDB].[meal] WHERE mealID = @mealID AND userID = @userID COMMIT TRANSACTION')
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved sletning af brugerens måltid i enten [NutriDB].[meal] eller [NutriDB].[mealIngredient] :', error);
      throw error;
    }
  }

}