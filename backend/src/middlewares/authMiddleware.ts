import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    const masterKey = process.env.ADMIN_API_KEY;

    if (!masterKey) {
        console.warn('CRITICAL: ADMIN_API_KEY not set in backend .env');
        return res.status(500).json({ error: 'Erro de configuração no servidor' });
    }

    if (!apiKey || apiKey !== masterKey) {
        return res.status(401).json({ error: 'Não autorizado. API Key inválida ou ausente.' });
    }

    next();
};
