import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest} from '@jest/globals';

import User from "../../models/user.js";
import * as authController from "../authController.js";

const { register, login } = authController;

describe("AuthController Prueba para el registro y login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // afterEach(() => {
  // });
  // afterAll(() => {
  // });
  // beforeAll(() => {
  // });
  describe("register, Registro de usuarios", () => {
    it("Deberia crear un nuevo usuario", async () => {
      const mockUser = {
        displayName: "finux",
        email: "finux@finux.com",
        password: "finux123",
        phone: "1234567890",
      };

      jest.spyOn(User, "findOne").mockResolvedValue(null);
      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword123");

      const mockSaveUser = jest.fn().mockResolvedValue({
        _id: "user123",
        displayName: mockUser.displayName,
        email: mockUser.email,
        role: "guest",
        phone: mockUser.phone,
      });

      jest.spyOn(User.prototype, "save").mockImplementation(mockSaveUser);

      const req = {
        body: mockUser,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await register(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(mockSaveUser).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        displayName: mockUser.displayName,
        email: mockUser.email,
        phone: mockUser.phone,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("Deberia rechazar el registro si el email ya existe", async () => {
      const existingUser = {
        displayName: "Usuario Existente",
        email: "existente@example.com",
        password: "password123",
        phone: "9876543210",
      };

      jest.spyOn(User, 'findOne').mockResolvedValue({
        _id: 'existingUserId',
        email: existingUser.email,
        displayName: existingUser.displayName
      });
       const req = {
        body: existingUser
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await register(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: existingUser.email });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'User already exist' 
      });
      expect(next).not.toHaveBeenCalled();
    });
  })
/*    
    afterEach(()=>{
    });
    afterAll(()=>{
    });
    beforeAll(()=>{
    });
*/
  describe('login, Login de los usuarios', () => {
    it('Debería loguear al usuario exitosamente', async () => {
      const mockUser = {
        email: 'test@test.com',
        password: 'password123',
      };

      const mockUserFromDB = {
        _id: 'user123',
        displayName: 'Test User',
        email: mockUser.email,
        hashPassword: 'hashedPassword123',
        role: 'guest',
        phone: '1234567890',
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(mockUserFromDB);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const mockToken = 'mockJWTToken123';
      const mockRefreshToken = { token: 'mockRefreshToken123',  userId: 'user123' };

      jest.spyOn(jwt, 'sign')
        .mockReturnValueOnce(mockToken)
        .mockReturnValueOnce(mockRefreshToken.token);

      const req = {
        body: mockUser,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await login(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(mockUser.password, mockUserFromDB.hashPassword);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: mockToken,
        refreshToken: mockRefreshToken.token,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('Debería rechazar el login si el usuario no existe', async () => {
      const noExistingUser = {
        email: 'noexiste@example.com',
        password: 'password123',
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      const req = {
        body: noExistingUser,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await login(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: noExistingUser.email });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User does not exist. You must to sign in',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('Debería rechazar el login si las credenciales no son válidas', async () => {
      const userWithWrongPassword = {
        email: 'existente@example.com',
        password: 'wrongPassword',
      };

      const mockUserFromDB = {
        _id: 'existingUserId',
        email: userWithWrongPassword.email,
        displayName: 'Usuario Existente',
        hashPassword: 'hashedPassword123',
        role: 'guest',
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(mockUserFromDB);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const req = {
        body: userWithWrongPassword,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await login(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: userWithWrongPassword.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        userWithWrongPassword.password,
        mockUserFromDB.hashPassword
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
      expect(next).not.toHaveBeenCalled();
    });

    })
});