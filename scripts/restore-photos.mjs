import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { strToU8, zipSync } from "fflate";

// Runs only during configuration/build, never from a serverless request.
// Original bytes are shipped with the source: there are no network requests.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const library = path.join(root, "media-library");
const manifest = JSON.parse(readFileSync(path.join(library, "manifest.json"), "utf8"));
const checkOnly = process.argv.includes("--check");
const hash = (data) => createHash("sha256").update(data).digest("hex");
const zipEntries = {};
let restored = 0;

function atomicWrite(filename, data) {
  mkdirSync(path.dirname(filename), { recursive: true });
  const temporary = `${filename}.tmp-${process.pid}`;
  writeFileSync(temporary, data);
  renameSync(temporary, filename);
}

if (manifest.version !== 1 || !Array.isArray(manifest.files) || !manifest.files.length) {
  throw new Error("Медиатека отсутствует или повреждена: нужен media-library/manifest.json.");
}

for (const file of manifest.files) {
  if (!/^\/photos\/(news|stock)\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(file.path)) {
    throw new Error(`Недопустимый путь фотографии: ${file.path}`);
  }
  const expectedBundle = `originals/${file.path.slice("/photos/".length)}.json`;
  if (file.bundle !== expectedBundle) throw new Error("Недопустимый путь оригинала.");
  const bundlePath = path.join(library, expectedBundle);
  if (!existsSync(bundlePath)) {
    throw new Error(`Нет ${expectedBundle}. Перенесите папку media-library целиком; внешние фото не используются.`);
  }
  const bundle = JSON.parse(readFileSync(bundlePath, "utf8"));
  const bytes = Buffer.from(bundle.data, "base64");
  if (bundle.encoding !== "base64" || bytes.length !== file.bytes || hash(bytes) !== file.sha256 || bundle.sha256 !== file.sha256) {
    throw new Error(`Контрольная сумма фотографии не совпала: ${file.filename}`);
  }
  const target = path.join(root, "public", file.path.slice(1));
  const valid = existsSync(target) && hash(readFileSync(target)) === file.sha256;
  if (!valid && checkOnly) throw new Error(`Нет локального оригинала: ${target}. Запустите node scripts/restore-photos.mjs.`);
  if (!valid) {
    atomicWrite(target, bytes);
    restored += 1;
  }
  zipEntries[`public${file.path}`] = new Uint8Array(bytes);
}

if (!checkOnly) {
  zipEntries["photos-manifest.json"] = strToU8(JSON.stringify(manifest, null, 2));
  zipEntries["README.txt"] = strToU8(
    "НОФХ — локальные оригиналы фотографий.\n\n" +
    "Поместите public/photos рядом с src и package.json.\n" +
    "Все снимки находятся в этом архиве: nofh.ru, Pexels и другие серверы не нужны для их показа.\n" +
    "Авторы указаны в photos-manifest.json. Фотографии сохраняют права своих авторов.\n" +
    "Новые фотографии из админки хранятся в вашей PostgreSQL-базе и в этот исходный архив не входят.\n"
  );
  const zip = zipSync(zipEntries, { level: 0, mtime: new Date("2026-01-01T12:00:00Z") });
  atomicWrite(path.join(root, "public/photos/nofh-originals.zip"), zip);
}

console.log(`[photos] ${manifest.files.length} локальных оригинала проверены; восстановлено: ${restored}. Интернет не используется.`);
