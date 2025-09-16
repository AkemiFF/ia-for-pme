// ===========================
// use-auth.ts (client)
// ===========================
// Client helper that talks only to /api/auth/custom-login
// - Uses credentials: 'include' so the HttpOnly cookie set by the server is stored
// - The server also returns the token in the JSON response (so you can store it if you want)


import jwt from 'jsonwebtoken';

export type User = {
    id: string;
    email: string;
    name?: string;
};

export type LoginResult = {
    ok: boolean;
    user?: User;
    token?: string;
    error?: string;
};

const API = '/api/auth/custom-login';

function setCookie(name: string, value: string, maxAgeSeconds: number) {
    if (typeof document === 'undefined') return;
    const secure = location.protocol === 'https:' ? 'Secure;' : '';
    // SameSite=Strict pour limiter les risques de CSRF, Path=/ pour access global
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Strict; ${secure}`;
}

export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const c of cookies) {
        const [k, ...v] = c.split('=');
        if (decodeURIComponent(k) === name) return decodeURIComponent(v.join('='));
    }
    return null;
}

function deleteCookie(name: string) {
    if (typeof document === 'undefined') return;
    // Max-Age=0 pour effacer immédiatement
    const secure = location.protocol === 'https:' ? 'Secure;' : '';
    document.cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0; SameSite=Strict; ${secure}`;
}

// helper : génère un token opaque sécurisé (UUID ou random bytes base64)
function generateClientToken(): string {
    if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) {
        return (crypto as any).randomUUID(); // simple et lisible
    }
    // fallback: 32 random bytes -> base64 url-safe
    const bytes = new Uint8Array(32);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(bytes);
    } else {
        // fallback JS PRNG (moins sûr) — très improbable sur navigateurs modernes
        for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    // base64 url-safe
    const b64 = btoa(String.fromCharCode(...Array.from(bytes)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function parseJwtPayload(token: string): any | null {
    try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(payload)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

export async function isAuthenticated(): Promise<{ authenticated: boolean; user?: User; error?: string }> {
    // 1) Préférence : demander au serveur (si ton endpoint supporte GET et vérifie cookie ou Authorization header)
    try {
        // Essaye GET avec les cookies (HttpOnly cookie case)
        let res = await fetch(API, { method: 'GET', credentials: 'include' });
        if (res.ok) {
            const data = await res.json().catch(() => ({}));
            if (data?.user) return { authenticated: true, user: data.user };
            // si serveur renvoie ok sans user, considère authentifié ? non -> fallback
        }

        // Si la première requête a échoué, essaye avec Authorization header (si tu as stocké token accessible en JS)
        const token = getCookie('token') ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null);
        if (token) {
            res = await fetch(API, { method: 'GET', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
            if (res.ok) {
                const data = await res.json().catch(() => ({}));
                if (data?.user) return { authenticated: true, user: data.user };
                // else -> continue to local checks
            }
        }
    } catch (err) {
        // ignore network errors for now, we'll try local verification next
    }

    // 2) Vérification locale minimale (utile si token est un JWT accessible côté client)
    const localToken = getCookie('token') ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null);
    if (!localToken) return { authenticated: false, error: 'No token found' };

    // Si token ressemble à un JWT, vérifie exp si présent
    if (localToken.split('.').length === 3) {
        const payload = parseJwtPayload(localToken);
        if (!payload) return { authenticated: false, error: 'Malformed JWT' };
        if (payload.exp) {
            // exp is in seconds since epoch
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp <= now) return { authenticated: false, error: 'Token expired' };
        }
        // On ne peut PAS vérifier la signature côté client sans clé publique (RS256) ou la secret (HS256) — donc
        // on considère l'utilisateur "probablement" authentifié côté client si exp ok.
        return { authenticated: true, error: 'Locally validated token (no server signature verification)' };
    }

    // Si token n'est pas JWT (opaque) : impossible de valider côté client -> il faut vérifier côté serveur
    return { authenticated: false, error: 'Opaque token present but cannot be validated client-side. Validate on server.' };
}
export async function login(email: string, password: string): Promise<LoginResult> {
    try {
        const res = await fetch(API, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) return { ok: false, error: data?.error ?? `HTTP ${res.status}` };

        // Le serveur renvoie uniquement l'objet user (ex: { id, email, name, role })
        const user = {
            id: data.id ?? data?.user?.id,
            email: data.email ?? data?.user?.email,
            name: data.name ?? data?.user?.name,
            role: data.role ?? data?.user?.role,
        };

        // Génère un token côté client (opaque)
        const token = generateClientToken();

        // Stocke le token en cookie client-side (ou change le nom si tu préfères)
        const MAX_AGE = 7 * 24 * 60 * 60; // 7 jours
        setCookie('token', token, MAX_AGE);

        // Optionnel : tu peux aussi stocker user dans localStorage pour éviter GET fréquent
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(user));
            }
        } catch (e) {
            // ignore si l'accès au localStorage est bloqué
        }

        return { ok: true, user, token };
    } catch (err: any) {
        return { ok: false, error: err?.message ?? String(err) };
    }
}

// ---- modifié logout() ----
export async function logout(): Promise<{ ok: boolean; error?: string }> {
    try {
        // Efface le cookie côté serveur (DELETE) si le serveur le gère
        const res = await fetch(API, {
            method: 'DELETE',
            credentials: 'include',
        });

        // Efface aussi le cookie côté client (au cas où)
        deleteCookie('token');

        if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            return { ok: false, error: d?.error ?? `HTTP ${res.status}` };
        }
        return { ok: true };
    } catch (err: any) {
        // on supprime tout de même le cookie local
        deleteCookie('token');
        return { ok: false, error: err?.message ?? String(err) };
    }
}

export async function getUser(): Promise<{ ok: boolean; user?: User; error?: string }> {
    try {
        // GET returns current user if token cookie is valid
        const res = await fetch(API, { method: 'GET', credentials: 'include' });
        const data = await res.json();
        if (!res.ok) return { ok: false, error: data?.error ?? `HTTP ${res.status}` };
        return { ok: true, user: data.user };
    } catch (err: any) {
        return { ok: false, error: err?.message ?? String(err) };
    }
}

// Optional helper to include Authorization header if you stored token manually
export function authHeaderFromToken(token?: string) {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
}

// Example fetch wrapper that uses cookie-based auth (preferred). If you want to use token stored in localStorage,
// pass `token` and it will set Authorization header.
export async function fetchWithAuth(input: RequestInfo, init?: RequestInit, token?: string) {
    const merged: RequestInit = {
        credentials: 'include',
        headers: { ...(init?.headers ?? {}) },
        ...init,
    };
    if (token) {
        // optional: use token in Authorization header if you stored it
        (merged.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return fetch(input, merged);
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'change_this_in_prod';
const TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

type DemoUser = { id: string; email: string; name?: string };

// Replace this with your real user lookup (DB) and password verification (hash compare)
async function validateUser(email: string, password: string): Promise<DemoUser | null> {
    // demo: use env-provided credentials or a hard-coded fallback
    const demoEmail = process.env.DEMO_USER_EMAIL ?? 'demo@example.com';
    const demoPass = process.env.DEMO_USER_PASSWORD ?? 'password123';

    if (email === demoEmail && password === demoPass) {
        return { id: '1', email: demoEmail, name: 'Demo User' };
    }

    // TODO: query your DB here and verify password (bcrypt.compare)
    return null;
}

function signToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE_SECONDS });
}

function parseCookie(cookieHeader: string | null): Record<string, string> {
    const out: Record<string, string> = {};
    if (!cookieHeader) return out;
    const parts = cookieHeader.split(';');
    for (const p of parts) {
        const [k, ...v] = p.split('=');
        if (!k) continue;
        out[k.trim()] = decodeURIComponent((v || []).join('=').trim());
    }
    return out;
}

// Next.js 13+ route handler style
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body ?? {};
        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const user = await validateUser(email, password);
        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        const token = signToken({ sub: user.id, email: user.email });

        // set HttpOnly cookie
        const isProd = process.env.NODE_ENV === 'production';
        const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${TOKEN_MAX_AGE_SECONDS}; SameSite=Strict; ${isProd ? 'Secure;' : ''}`;

        return new Response(JSON.stringify({ ok: true, user, token }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message ?? String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function GET(req: Request) {
    try {
        const cookieHeader = req.headers.get('cookie');
        const cookies = parseCookie(cookieHeader);
        const token = cookies['token'];
        if (!token) return new Response(JSON.stringify({ error: 'No token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            // In a real app you should load the user from DB using decoded.sub
            const user: DemoUser = { id: decoded.sub ?? 'unknown', email: decoded.email ?? 'unknown' };
            return new Response(JSON.stringify({ ok: true, user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch (e: any) {
            return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message ?? String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function DELETE(req: Request) {
    // logout: clear cookie
    const cookie = `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict;`;
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie } });
}
