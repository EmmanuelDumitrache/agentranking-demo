import { NextResponse } from "next/server";
import { PROMOTION_PRICES } from "@/lib/promotion-types";

export async function GET() {
  return NextResponse.json(PROMOTION_PRICES);
}
