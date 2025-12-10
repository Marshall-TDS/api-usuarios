import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../errors/AppError'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    console.log('[ErrorHandler] AppError capturado:', {
      statusCode: err.statusCode,
      message: err.message,
      details: err.details,
      path: req.path,
      method: req.method,
    })
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      details: err.details,
    })
  }

  console.error('[ErrorHandler] UnhandledError:', {
    error: err.message,
    stack: err.stack,
    name: err.name,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
  })

  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  })
}

