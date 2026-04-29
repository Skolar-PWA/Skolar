import { Matches } from 'class-validator';

/**
 * Primary-key strings for Prisma `String @id` columns.
 *
 * `IsUUID()` / `IsUUID('all')` require a **syntactically valid** RFC 4122 string.
 * Dev seeds may use a last segment of **8** hex digits (invalid RFC length) while
 * still being valid stored `String` ids — this matches that shape plus normal UUIDs.
 */
const PRISMA_DASHED_HEX_ID =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{12})$/;

export function IsDbUuid() {
  return Matches(PRISMA_DASHED_HEX_ID, {
    message:
      '$property must be a dashed hex id (standard UUID or legacy 8-hex last group, as used in dev seeds).',
  });
}
