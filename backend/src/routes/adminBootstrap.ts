import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

export const adminBootstrapRouter = Router();

// POST /api/admin/bootstrap-admin
// Body: { email, password, name? }
adminBootstrapRouter.post('/', async (req, res) => {
  try {
    const { email, password, name } = req.body as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!email || !password) {
      return res.status(400).json({ error: 'email e password são obrigatórios' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || 'Admin',
        password: passwordHash,
        role: 'ADMIN' as any,
      },
      create: {
        email,
        name: name || 'Admin',
        password: passwordHash,
        role: 'ADMIN' as any,
      },
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao criar/atualizar admin' });
  }
});

// GET /api/admin/bootstrap-admin/once
// Rota temporária para criar um admin padrão acessando direto pelo navegador
// Cria ou atualiza o usuário real: email: filiperocha.aquino@gmail.com
adminBootstrapRouter.get('/once', async (_req, res) => {
  try {
    const email = 'filiperocha.aquino@gmail.com';
    const plainPassword = 'Filipeaquino9762517628@';

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: 'Admin',
        password: passwordHash,
        role: 'ADMIN' as any,
      },
      create: {
        email,
        name: 'Admin',
        password: passwordHash,
        role: 'ADMIN' as any,
      },
    });

    return res
      .status(200)
      .send(`<!DOCTYPE html><html><body><h1>Admin criado/atualizado com sucesso</h1><p>Email: <b>${user.email}</b></p><p>Senha: <b>${plainPassword}</b></p><p>Agora acesse o frontend em <code>/admin-login</code> e faça login com essas credenciais.</p></body></html>`);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .send('<h1>Erro ao criar/atualizar admin</h1><p>Verifique o log do servidor.</p>');
  }
});
