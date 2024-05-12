import * as chai from 'chai';
const expect = chai.expect;
import bcrypt from 'bcryptjs'
import { describe, it } from 'mocha';
import { validateLogin } from '../controller/login.js';  // Ret stien efter behov


// Test suite til validering af login
describe('Login validerings test', function() {

    // Test til at validere, når der ikke findes en bruger med den givne email
    it('ingen bruger med denne email', function() {
        let user = { email: 'test@example.com', password: 'test123' };
        let result = validateLogin(user, null);
        expect(result.valid).to.be.false;
        expect(result.message).to.equal('No user with that email');
    });

        // Test til at validere, når der er et forkert password
    it('Forkert password', function() {
        let user = { email: 'test@example.com', password: 'test123' };
        let DBuser = { email: 'test@example.com', password: '38292931' };
        bcrypt.compareSync = () => false;
        let result = validateLogin(user, DBuser);
        expect(result.valid).to.be.false;
        expect(result.message).to.equal('Wrong password');
    });

        // Test til at validere, når der er en rigtig email, men forkert password
    it('Rigtig password forkert email', function() {
        let user = { email: 'test@example.com', password: 'test123' };
        let DBuser = { email: 'test2@example.com', password: 'test123' }; // Simulate correct bcrypt comparison
        bcrypt.compareSync = () => false; // Mock bcrypt comparison for the test case
        let result = validateLogin(user, DBuser);
        expect(result.valid).to.be.false;
    });

    // Test til at validere, når der er en rigtig email og password
    it('Rigtig email og password', function() {
        let user = { email: 'test@example.com', password: 'test123' };
        let DBuser = { email: 'test@example.com', password: 'test123' }; // Simulate correct bcrypt comparison
        bcrypt.compareSync = () => true; // Mock bcrypt comparison for the test case
        let result = validateLogin(user, DBuser);
        expect(result.valid).to.be.true;
    });
});

