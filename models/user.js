// models/User.js
// import sql from 'mssql';


class User {
  constructor(name, password, email, age, weight, gender) {
    this.name = name;
    this.password = password;
    this.email = email;
    this.age = age;
    this.weight = weight;
    this.gender = gender;
  }

  // async save() {
  //   try {
  //     await this.connect();
  //     const request = this.poolconnection.request()
  //       .input('name', sql.NVarChar, this.name)
  //       .input('password', sql.NVarChar, this.password)
  //       .input('email', sql.NVarChar, this.email)
  //       .input('age', sql.Int, this.age)
  //       .input('weight', sql.Int, this.weight)
  //       .input('gender', sql.NVarChar, this.gender);
      
  //     const result = await request.query(`INSERT INTO NutriDB.users (name, password, email, age, weight, gender) VALUES (@name, @password, @email, @age, @weight, @gender`);
  //     return result.recordsets[0];
  //   } catch (error) {
  //     console.error('Error creating user:', error);
  //     throw error;
  //   }
  // }
}

export default User;

