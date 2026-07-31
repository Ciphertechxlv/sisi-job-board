import { NextRequest, NextResponse } from "next/server";
import { DREAM_COMPANIES, ROLES, RoleKey } from "@/lib/companies";
import { resolveCompany } from "@/lib/fetchers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const roleKey = req.nextUrl.searchParams.get("role") as RoleKey | null;
  const role = ROLES.find((r) => r.key === roleKey);
  const roleKeywords = role ? role.keywords : [];
  const roleQuery = role ? role.label : "";

  const results = await Promise.all(
    DREAM_COMPANIES.map((company) =>
      resolveCompany(company, roleKeywords, roleQuery)
    )
  );

  return NextResponse.json({
    role: role?.key ?? null,
    generatedAt: new Date().toISOString(),
    results,
  });
}
