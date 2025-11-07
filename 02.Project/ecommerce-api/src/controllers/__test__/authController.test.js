import bcrypt from 'bcrypt';
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest} from '@jest/globals';

import User from '../../models/user.js';
import {register} from '../authController.js';
import { body } from 'express-validator';

describe('AuthController Prueba para el registro y login',()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });
/*    
    afterEach(()=>{
    });
    afterAll(()=>{
    });
    beforeAll(()=>{
    });
*/
    describe('register, Registro de usuarios', ()=>{
        it('Debería crear un nuevo usuario', async ()=>{
            const mockUser = {
                displayName:'userTest',
                email:'test@test.com',
                password:'password123',
                phone:'1234567890',
            };
            
            jest.spyOn(User,'findOne').mockResolvedValue(null);
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123');

            const mockSaveUser=jest.fn().mockResolvedValue({
                _id:'user123',
                displayName: mockUser.displayName,
                email: mockUser.email,
                role:'guest',
                phone: mockUser.phone
            });

            jest.spyOn(User.prototype, 'save').mockImplementation(mockSaveUser);
            
            const req={
                body:mockUser
            };
            const rest={
                status:jest.fn().mockReturnThis(),
                json:jest.fn()
            }
            const next=jest.fn()

            await register(req, rest, next);

            expect(User.findOne).toHaveBeenCalledWith({email:mockUser.email});
            expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
            expect(mockSaveUser).toHaveBeenCalled();
            expect(rest.status).toHaveBeenNthCalledWith(201);
            expect(rest.json).toHaveBeenCalledWith({
                displayName: mockUser.displayName,
                email:mockUser.email,
                phone:mockUser.phone
            });
            expect(next).not.toHaveBeenCalled();
        })
    })

//    describe('login, login de los usuarios')
})