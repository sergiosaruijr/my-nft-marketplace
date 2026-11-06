import { http, HttpResponse, delay } from "msw";
import { getDb, saveDb, sha256, type StoredUser } from "./db";

const pub = ({ passwordHash: _, ...u }: StoredUser) => u;
const emailOk = (s: string) => /^\S+@\S+\.\S+$/.test(s);

export const authHandlers = [
  http.post("*/api/auth/signup", async ({ request }) => {
    await delay(400);
    const b = (await request.json()) as {
      username?: string;
      email?: string;
      password?: string;
    };
    const db = await getDb();
    const fields: Record<string, string> = {};
    if (!b.username || b.username.trim().length < 3)
      fields.username = "Use ao menos 3 caracteres";
    if (!b.email || !emailOk(b.email))
      fields.email = "Informe um e-mail válido";
    if (!b.password || b.password.length < 8)
      fields.password = "Use ao menos 8 caracteres";
    if (Object.keys(fields).length)
      return HttpResponse.json(
        { error: "validation", message: "Verifique os campos.", fields },
        { status: 422 },
      );

    const email = b.email!.toLowerCase();
    if (db.users.some((u) => u.email === email))
      return HttpResponse.json(
        {
          error: "conflict",
          message: "Este e-mail já está cadastrado.",
          fields: { email: "E-mail já cadastrado" },
        },
        { status: 409 },
      );

    const user: StoredUser = {
      id: crypto.randomUUID(),
      username: b.username!.trim(),
      email,
      passwordHash: await sha256(b.password!),
    };
    const token = crypto.randomUUID();
    db.users.push(user);
    db.sessions[token] = user.id;
    saveDb();
    return HttpResponse.json({ token, user: pub(user) }, { status: 201 });
  }),

  http.post("*/api/auth/login", async ({ request }) => {
    await delay(400);
    const b = (await request.json()) as { email?: string; password?: string };
    const db = await getDb();
    const user = db.users.find((u) => u.email === b.email?.toLowerCase());
    if (!user || user.passwordHash !== (await sha256(b.password ?? "")))
      return HttpResponse.json(
        {
          error: "invalid_credentials",
          message: "E-mail ou senha incorretos.",
        },
        { status: 401 },
      );
    const token = crypto.randomUUID();
    db.sessions[token] = user.id;
    saveDb();
    return HttpResponse.json({ token, user: pub(user) });
  }),

  http.get("*/api/auth/session", async ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const db = await getDb();
    const user = token && db.users.find((u) => u.id === db.sessions[token]);
    if (!user)
      return HttpResponse.json({ error: "session_invalid" }, { status: 401 });
    return HttpResponse.json({ user: pub(user) });
  }),

  http.post("*/api/auth/logout", async ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const db = await getDb();
    if (token) delete db.sessions[token];
    saveDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
