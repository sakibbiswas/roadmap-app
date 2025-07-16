"use strict";
// import { Request, Response, NextFunction } from 'express';
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || 'Internal Server Error' });
};
exports.errorHandler = errorHandler;
