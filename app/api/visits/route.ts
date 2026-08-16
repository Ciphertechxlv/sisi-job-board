import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Today's date as YYYY-MM-DD in Lagos time — a fresh key each day means
 * the counter naturally starts back at 1 with no reset logic required. */
function todayKeyLagos(): string {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return `sisi-wanted-board:visits:${ymd}`;
}

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    // Not configured yet — hide the counter rather than show a broken one.
    return NextResponse.json({ count: null });
  }

  try {
    const key = todayKeyLagos();
    const count = await redis.incr(key);
    // Let old keys expire on their own instead of growing forever. 36h
    // comfortably covers "the rest of today" no matter what time it is
    // when this first runs, and by tomorrow a new key takes over anyway.
    await redis.expire(key, 60 * 60 * 36);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: null });
  }
}
