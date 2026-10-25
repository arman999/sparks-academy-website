import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { handleRegistration, type RegistrationEnv } from "../../lib/registration";

// This route runs on Cloudflare for every submission (everything else is pre-built).
export const prerender = false;

export const POST: APIRoute = ({ request }) => handleRegistration(request, env as unknown as RegistrationEnv);

export const GET: APIRoute = ({ redirect }) => redirect("/join", 302);
