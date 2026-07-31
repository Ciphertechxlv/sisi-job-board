import { NextRequest, NextResponse } from "next/server";
import { ROLES, RoleKey } from "@/lib/companies";
import { resolveDirectPulls, resolveRoleFeed } from "@/lib/fetchers";
import { FeedResponse } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const roleParam = req.nextUrl.searchParams.get("role") as RoleKey | null;
  const role = ROLES.find((r) => r.key === roleParam) ?? null;

  const [feed, directPulls] = await Promise.all([
    resolveRoleFeed(role?.key ?? null),
    resolveDirectPulls(role?.key ?? null),
  ]);

  const body: FeedResponse = {
    role: role?.key ?? null,
    generatedAt: new Date().toISOString(),
    feedStatus: feed.status,
    postings: feed.postings,
    directPulls,
  };

  return NextResponse.json(body);
}
