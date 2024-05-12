//Test af login
import * as chai from 'chai'; // Importerer chai-biblioteket
const expect = chai.expect; // Forventningsstykker fra chai
import bcrypt from 'bcryptjs' // Importerer bcryptjs til kryptering af passwords
import { describe, it } from 'mocha'; // Beskriver og specificerer testcases fra mocha
import { validateLogin } from '../controller/login.js';  


// Beskriver en test suite for login-validering
describe('Login validerings test', function() {
        // Test tilfælde: Ingen bruger med denne email
    it('ingen bruger med denne email', function() {
        let user = { email: 'test@example.com', password: 'test123' }; // eks på en bruger, der forsøger at logge ind

        let result = validateLogin(user, null);// Validerer login med en null databasebruger
        expect(result.valid).to.be.false;  // Forventer, at valideringsresultatet er falsk
        expect(result.message).to.equal('No user with that email'); 
    });

        // Test tilfælde: Forkert password
    it('Forkert password', function() {
        let user = { email: 'test@example.com', password: 'test123' }; // Simulerer en bruger, der forsøger at logge ind
        let DBuser = { email: 'test@example.com', password: '38292931' }; // Simulerer en bruger i databasen
        bcrypt.compareSync = () => false; // Mock bcrypt sammenligning for testcasen
        let result = validateLogin(user, DBuser); // Validerer login med den simulerede databasebruger
        expect(result.valid).to.be.false; // Forventer, at valideringsresultatet er falsk
        expect(result.message).to.equal('Wrong password');
    });

        // Test tilfælde: Rigtig password, forkert email
    it('Rigtig password forkert email', function() {
        let user = { email: 'test@example.com', password: 'test123' }; // Simulerer en bruger, der forsøger at logge in
        let DBuser = { email: 'test2@example.com', password: 'test123' }; // Simulerer en bruger i databasen
        bcrypt.compareSync = () => false; // Mock bcrypt sammenligning for testcasen
        let result = validateLogin(user, DBuser); // Validerer login med den simulerede databasebruger
        expect(result.valid).to.be.false; // Forventer, at valideringsresultatet er falsk
    });

        // Test tilfælde: Rigtig email og password
    it('Rigtig email og password', function() {
        let user = { email: 'test@example.com', password: 'test123' }; // Simulerer en bruger, der forsøger at logge ind
        let DBuser = { email: 'test@example.com', password: 'test123' }; // Simulerer en bruger i databasen
        bcrypt.compareSync = () => true; // Mock bcrypt sammenligning for testcasen
        let result = validateLogin(user, DBuser); // Validerer login med den simulerede databasebruger
        expect(result.valid).to.be.true; // Forventer, at valideringsresultatet er sandt
    });
});

