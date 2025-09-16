// app/api/auth/custom-login/route.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev_secret_change_me';
const TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 jours

type DemoUser = { id: string; email: string; name?: string; role?: string };

// <<< Remplace validateUser() par ta logique réelle (DB + bcrypt) >>>
async function validateUser(email: string, password: string): Promise<DemoUser | null> {
  const demoEmail = process.env.DEMO_USER_EMAIL ?? 'admin@example.com';
  const demoPass = process.env.DEMO_USER_PASSWORD ?? 'password123';
  if (email === demoEmail && password === demoPass) {
    return { id: '8813a0a4-00f0-4ec3-b739-44836aa7afc3', email: demoEmail, name: 'Admin User', role: 'admin' };
  }
  return null;
}

function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE_SECONDS });
}

function parseCookies(cookieHeader: string | null) {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  cookieHeader.split(';').forEach((c) => {
    const [k, ...v] = c.split('=');
    if (!k) return;
    out[k.trim()] = decodeURIComponent((v || []).join('=').trim());
  });
  return out;
}

/* -----------------------
   POST /api/auth/custom-login
   -> login : valide, signe JWT et set-cookie
   ----------------------- */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body ?? {};
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const user = await validateUser(email, password);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const token = signToken({ sub: user.id, email: user.email, role: user.role });

    // Ne pas mettre Secure en dev (localhost HTTP)
    const isProd = process.env.NODE_ENV === 'production';
    const secureFlag = isProd ? 'Secure;' : '';
    const cookie = `token=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${TOKEN_MAX_AGE_SECONDS}; SameSite=Strict; ${secureFlag}`;

    return new Response(JSON.stringify({ ok: true, user }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie,
      },
    });
  } catch (err: any) {
    console.error('POST /api/auth/custom-login error:', err);
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

/* -----------------------
   GET /api/auth/custom-login
   -> vérifie le cookie / Authorization Bearer
   ----------------------- */
export async function GET(req: Request) {
  try {
    // DEBUG : montre ce que le serveur reçoit
    console.log('GET /api/auth/custom-login headers.cookie =', req.headers.get('cookie'));

    const cookieHeader = req.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const cookieToken = cookies['token'] ?? null;

    // fallback Authorization header
    const authHeader = req.headers.get('authorization');
    const bearer = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    const tokenToVerify = cookieToken || bearer;
    if (!tokenToVerify) return new Response(JSON.stringify({ error: 'No token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    try {
      const decoded: any = jwt.verify(tokenToVerify, JWT_SECRET);
      const user: DemoUser = { id: decoded.sub ?? 'unknown', email: decoded.email ?? 'unknown', role: decoded.role ?? undefined };
      return new Response(JSON.stringify({ ok: true, user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (e: any) {
      console.log('JWT verify failed:', e?.message ?? e);
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (err: any) {
    console.error('GET /api/auth/custom-login error:', err);
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

/* -----------------------
   DELETE /api/auth/custom-login
   -> logout : efface le cookie
   ----------------------- */
export async function DELETE() {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const secureFlag = isProd ? 'Secure;' : '';
    const cookie = `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; ${secureFlag}`;
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie } });
  } catch (err: any) {
    console.error('DELETE /api/auth/custom-login error:', err);
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
