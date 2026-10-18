import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { questions } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(questions)
      .orderBy(desc(questions.createdAt))
      .limit(20);
    return NextResponse.json({ questions: rows });
  } catch {
    return NextResponse.json({ questions: [] });
  }
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const name = String(payload.name ?? "").trim();
  const contact = String(payload.contact ?? "").trim();
  const topic = String(payload.topic ?? "Общий вопрос").trim();
  const message = String(payload.message ?? "").trim();

  if (name.length < 2) {
    return NextResponse.json({ error: "Укажите имя" }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json(
      { error: "Вопрос должен содержать минимум 10 символов" },
      { status: 400 },
    );
  }

  try {
    const [row] = await db
      .insert(questions)
      .values({
        name: name.slice(0, 120),
        contact: contact.slice(0, 160),
        topic: topic.slice(0, 80),
        message: message.slice(0, 4000),
      })
      .returning();
    return NextResponse.json({ ok: true, question: row }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Не удалось сохранить обращение. Попробуйте позже." },
      { status: 500 },
    );
  }
}
