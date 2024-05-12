import { query } from 'express';
import sql from 'mssql';

/*
Oversigt over funktioner:
1. Brugerstyring    -> l. 62 - 151
2. Meal Creator     -> l. 168 - 270
3. Meal Tracker     -> l. 286 - 385
4. Activity Tracker -> l. 402 - 468
5. Daily Nutri      -> l. 480 - 494
*/





// Database klasse, hvor databasen forbindes og alle querys løber igennem
export default class Database {
  config = {};
  poolconnection = null;
  connected = false;

  constructor(config) {
    this.config = config;
    console.log(`Database: config: ${JSON.stringify(config)}`);
  }

  // Connecte til databasen
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
  // disconnecte fra databasen
  async disconnect() {
    try {
      this.poolconnection.close();
      console.log('Database connection closed');
    } catch (error) {
      console.error(`Error closing database connection: ${error}`);
    }
  }










  /*_______________________________________________________________________________________________________________________________________*/
  /*_____________________________________________________________BRUGERSTYRING_____________________________________________________________*/


  // Opret en bruger [NutriDB].[users]
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

  // Slet en bruger og de tilhørende data der ligger i de andre tabeller som en bruger kan have information gemt i
  // [NutriDB].[activityTracker], [NutriDB].[mealTracker], [NutriDB].[meal], [NutriDB].[totalNutrientsForCreateMeal], [NutriDB].[users]
  async deleteUserId(id) {
    try {
      await this.connect();

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
      throw error;
    }
  }


  // Opdatering af en bruger (Mulighed for at opdatere email, alder, vægt, køn) [NutriDB].[users]
  async updateUser(email, age, weight, gender, metabolism) {
    await this.connect();
    try {
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

  // Find brugere på baggrund af e-mails
  async getUserByMail(email) {
    await this.connect();
    const request = this.poolconnection.request();
    const result = await request
      .input('email', sql.NVarChar, email)
      .query(`SELECT * FROM NutriDB.users WHERE email = @email`)
    return result.recordset[0];
  }


  // Sletter et måltid i både meal og mealIngredient (der skal bruges mealID og UserID for at slette. Bemærk begin og commit transaction gør, at hvis én af disse slettefunktioner slår fejl, vil den ikke slette noget (for at sikre at alt er relationelt))
  async deleteMeal(mealID, userID) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('mealID', sql.Int, mealID)
        .input('userID', sql.Int, userID)
        .query('BEGIN TRANSACTION DELETE FROM [NutriDB].[totalNutrientsForCreateMeal] WHERE mealID = @mealID DELETE FROM [NutriDB].[mealTracker] WHERE mealID = @mealID DELETE FROM [NutriDB].[mealIngredient] WHERE mealID = @mealID DELETE FROM [NutriDB].[meal] WHERE mealID = @mealID COMMIT TRANSACTION')
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved sletning af brugerens måltid i enten [NutriDB].[meal] eller [NutriDB].[mealIngredient] :', error);
      throw error;
    }
  }

  async updateMeal(mealID, userID, name, mealType, source, mealCateogry) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('userID', sql.Int, userID)
        .input('mealID', sql.Int, mealID)
        .input('name', sql.NVarChar, name)
        .input('mealType', sql.NVarChar, mealType)
        .input('source', sql.NVarChar, source)
        .input('mealCategory', sql.NVarChar, mealCateogry)
        .query('UPDATE [NutriDB].[meal] SET [NutriDB].[meal].name = @name,[NutriDB].[meal].mealType = @mealType, [NutriDB].[meal].source = @source, [NutriDB].[meal].mealCategory = @mealCategory WHERE mealID = @mealID AND userID = @userID;')
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved opdatering af brugerens måltid i [NutriDB].[meal] :', error);
      throw error;
    }
  }












  /*______________________________________________________________________________________________________________________________________*/
  /*_____________________________________________________________MEAL CREATOR_____________________________________________________________*/

  // Søgning af ingredienser via et inputfelt som får værdien searchTerm [NutriDB].[ingredient]
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


  /* 1: Indsætter et måltid via Meal Creator (Denne er todelt, da den først skal oprette måltidsnavnet og derefter ingredienser
  for at få mealID med over i mealIngredient)*/
  // [NutriDB].[meal]
  async postIntoDbMeal(name, userID, mealType, source) {
    try {
      await this.connect();
      const request = this.poolconnection.request();

      request.input('name', sql.NVarChar, name);
      request.input('UserID', sql.Int, userID);
      request.input('mealType', sql.NVarChar, mealType);
      request.input('source', sql.NVarChar, source);
      const result = await request.query(`INSERT INTO [NutriDB].[meal] (name, userID, mealType, source) OUTPUT INSERTED.mealID VALUES (@name, @UserID, @mealType, @source)`);
      return result.recordset[0].mealID;
    } catch (error) {
      console.error('Fejl af indsætning af måltidsnavn i [NutriDB].[meal] :', error);
      throw error;

    }
  }

  /* 2: Indsætter de ingredienser et måltid består af (bemærk at ernæringsværdierne skal være udregnet før de lægges herind). 
  mealID skal hentes fra det netop oprettet måltidsnavn*/
  //[NutriDB].[mealIngredient]
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

  // Indsætter de totale udregnende værdier for et måltid bestående af ét eller flere ingredienser
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

  // Samler alt information om diverse måltider oprettet af en bruger, herunder måltidsnavn, vægt, ingrediensnavne og makroer
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







  /*______________________________________________________________________________________________________________________________________*/
  /*_____________________________________________________________MEAL TRACKER_____________________________________________________________*/

  // Finder alle meals der er oprettet i mealTracker via et JOIN-statement for også at få navne på måltider
  // [NutriDB].[meal], [NutriDB].[mealTracker]
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


  // Finder alle oprettede måltider på baggrund af et userID og samler tabellerne meal, mealingredient og ingredients for at få et overblik over måltiderne
  // [NutriDB].[meal], [NutriDB].[mealTracker]
  async getAllUserMeal(userID) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      console.log(`Attempting to fetch meals for userID: ${userID}`);
      const result = await request
        .input('userID', sql.Int, userID)
        .query(`
      SELECT * FROM [NutriDB].[meal]
      JOIN [NutriDB].[mealTracker] ON [NutriDB].[meal].mealID = [NutriDB].[mealTracker].mealID
      WHERE [NutriDB].[meal].userID = @userID`);

      return result.recordset;
    } catch (error) {
      console.error('Fejl ved hentning af brugerens måltider:', error);
      throw error;
    }
  }


  // Funktion til at søge efter oprettede måltider fra mealCreator.
  // [NutriDB].[meal]
  async searchMeals(searchTerm, userID) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('searchTerm', sql.NVarChar, `%${searchTerm}%`)
        .input('userID', sql.Int, userID)
        .query('SELECT * FROM NutriDB.meal WHERE userID = @userID  AND name LIKE @searchTerm;');
      console.log(query);
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved søgning efter måltider:', error);
      throw error;
    }
  };


  // Finder informationer om ét måltid som en unik bruger har oprettet via userID og mealID
  // [NutriDB].[mealIngredient], [NutriDB].[meal], [NutriDB].[ingredient]
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
    }
  }

  async getTotalNutriens(mealID) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('mealID', sql.Int, mealID)
        .query('SELECT * FROM [NutriDB].[totalNutrientsForCreateMeal] WHERE mealID = @mealID')
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved hentning af brugerens måltider:', error);
      throw error;
    }
  }

  // Indsætning af måltid i mealtracker 
  async postIntoDbMealTracker(userID, mealID, quantity, regTime, getCityFromLocation, getTotalEnergyKj, getTotalProtein, getTotalFat, getTotalFiber, getTotalEnergyKcal, getTotalWater, getTotalDryMatter) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('userID', sql.Int, userID)
        .input('mealID', sql.Int, mealID)
        .input('quantity', sql.Int, quantity)
        .input('regTime', sql.Time, regTime)
        .input('date', sql.Date, regTime)
        .input('geoLocation', sql.NVarChar, getCityFromLocation)
        .input('mTenergyKj', sql.Int, getTotalEnergyKj)
        .input('mTProtein', sql.Int, getTotalProtein)
        .input('mTFat', sql.Int, getTotalFat)
        .input('mTFiber', sql.Int, getTotalFiber)
        .input('mTEnergyKcal', sql.Int, getTotalEnergyKcal)
        .input('mTWater', sql.Int, getTotalWater)
        .input('mTDryMatter', sql.Int, getTotalDryMatter)
        .query`
    INSERT INTO [NutriDB].[mealTracker] (userID, mealID, quantity, regTime, date, geoLocation, mTenergyKj, mTProtein, mTFat,mTFiber, mTEnergyKcal, mTWater, mTDryMatter)
    VALUES (@userID, @mealID, @quantity, @regTime, @date, @geoLocation, @mTenergyKj, @mTProtein, @mTFat, @mTFiber, @mTEnergyKcal, @mTWater, @mTDryMatter)`;
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved indsætning af brugerens måltid tracker i [NutriDB].[mealTracker]:', error);
      throw error;
    }
  }




  // Delete tracked meal
  async deleteTrackedMeal(mealID, userID) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('userID', sql.Int, userID)
        .input('mealID', sql.Int, mealID)
        .query('DELETE FROM [NutriDB].[mealTracker] WHERE mealID = @mealID AND userID = @userID;')
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved sletning af brugerens måltid i [NutriDB].[mealTracker]: ', error);
      throw error;
    }
  }


  async updateTrackedMeal(mealID, userID, quantity) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('userID', sql.Int, userID)
        .input('mealID', sql.Int, mealID)
        .input('quantity', sql.Int, quantity)
        .query('UPDATE [NutriDB].[mealTracker] SET [NutriDB].[mealTracker].quantity = @quantity WHERE mealID = @mealID AND userID = @userID;')
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved sletning af brugerens måltid i [NutriDB].[mealTracker]: ', error);
      throw error;
    }
  }










  /*___________________________________________________________________________________________________________________________________________*/
  /*_____________________________________________________________ACTIVITY TRACKER_____________________________________________________________*/



  // Søgefunktion til at søge efter aktiviteter. Den henter activityID, activityName og calouries pr time
  async searchActivity(searchTerm) {
    console.log("Before DB: ", searchTerm);
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('searchTerm', sql.NVarChar, `%${searchTerm}%`)
        .query(`SELECT * FROM NutriDB.activity WHERE activityName LIKE @searchTerm`);
      return result.recordset;
    } catch (error) {
      console.error('Fejl ved søgning efter aktiviteter:', error);
      throw error;
    }
  }

  // Poster aktivitetsdata ind for en pågældende bruger
  // Queryen laver også UTC om til GMT+2
  async postActivity(date, regtime, calories, userID, activityID, timeSpendt) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('date', sql.Date, date)
        .input('regTime', sql.NVarChar, regtime)
        .input('caloriesBurned', sql.Int, calories)
        .input('userID', sql.Int, userID)
        .input('activityID', sql.Int, activityID)
        .input('timeSpent', sql.Int, timeSpendt)
        .query(`
        DECLARE @CopenhagenTime AS datetimeoffset;
        SET @CopenhagenTime = SWITCHOFFSET(CAST(@regTime AS datetimeoffset), '+00:00');

        INSERT INTO [NutriDB].[activityTracker] (date, regTime, caloriesBurned, userID, activityID, timeSpent)
        VALUES (@date, @CopenhagenTime, @caloriesBurned, @userID, @activityID, @timeSpent)
      `);

      return result.recordset;
    } catch (error) {
      console.error('Fejl:', error);
      throw error;
    }
  }


  // Funktion til at søge efter aktiviteter som en bruger har udført
  async searchTrackedActivity(userID) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      console.log(`Attempting to fetch activities for userID: ${userID}`);
      const result = await request
        .input('userID', sql.NVarChar, userID)
        .query(`
      SELECT * FROM [NutriDB].[activityTracker]
      WHERE userID = @userID`);

      return result.recordset;
    } catch (error) {
      console.error('Fejl ved hentning af brugerens aktiviteter :', error);
      throw error;
    }
  }










  /*______________________________________________________________________________________________________________________________________*/
  /*_____________________________________________________________DAILY NUTRI_____________________________________________________________*/

  // Henter alle aktivitet som en bruger udført til display i Daily Nutri
  async getActivity(userID) {
    await this.connect();
    const request = this.poolconnection.request();
    const result = await request
      .input('userID', sql.Int, userID)
      .query(`SELECT * FROM [NutriDB].[activityTracker] WHERE userID = @userID  
    `);
    return result.recordset;
  }
}

// Tracked meals bliver kaldt i funktionen getTrackedMeals(userID)