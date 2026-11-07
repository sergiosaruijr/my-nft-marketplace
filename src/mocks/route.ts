import { HttpResponse, delay } from "msw";
import { destroySession, getDb, userIdFromToken, type DB } from "./db";
import { getScenario } from "./scenarios";

export type Ctx = {
  uid: string;
  db: DB;
  request: Request;
  params: Record<string, string>;
};
type Info = { request: Request; params: Record<string, unknown> };

let n = 0;
const rnd = () => {
  n += 1;
  let t = (n * 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const err = (
  status: number,
  error: string,
  message: string,
  extra: object = {},
) => HttpResponse.json({ error, message, ...extra }, { status });

async function gate(request: Request) {
  const s = getScenario();
  if (s.offline) return HttpResponse.error();
  await delay(Math.round(s.latency[0] + rnd() * (s.latency[1] - s.latency[0])));
  const { pathname } = new URL(request.url);
  const msg = "Falha temporária do servidor. Tente novamente.";
  if (s.error && !pathname.includes("/auth/"))
    return err(s.error, "server_error", msg);
  if (
    s.fail &&
    pathname.includes(s.fail.path) &&
    s.fail.methods.includes(request.method)
  )
    return err(s.fail.status, "server_error", msg);
}

function make(mode: "user" | "owner" | "open") {
  return (fn: (c: Ctx) => Response | Promise<Response>) =>
    async ({ request, params }: Info) => {
      const blocked = await gate(request);
      if (blocked) return blocked;

      const db = await getDb();
      const token = request.headers
        .get("Authorization")
        ?.replace("Bearer ", "");
      const userId = userIdFromToken(token);

      if (token && mode !== "open") {
        if (!userId) {
          console.warn(
            "[mock] token sem sessão em",
            new URL(request.url).pathname,
          );
          return err(401, "session_invalid", "Sessão expirada.");
        }
        if (getScenario().expireSession) {
          destroySession(token);
          sessionStorage.setItem("kurio.scenario", "default");
          return err(401, "session_invalid", "Sessão expirada.");
        }
      }

      const guest = request.headers.get("X-Guest-Id");
      const uid =
        userId ?? (mode === "owner" && guest ? `guest:${guest}` : undefined);
      if (!uid && mode === "user")
        return err(401, "session_invalid", "Faça login para continuar.");
      if (!uid && mode === "owner")
        return err(400, "missing_owner", "Identificação do visitante ausente.");
      return fn({
        uid: uid ?? "",
        db,
        request,
        params: params as Record<string, string>,
      });
    };
}

export const authed = make("user");
export const owned = make("owner");
export const open = make("open");
