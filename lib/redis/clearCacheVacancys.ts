import { redis } from "@/lib/redis/conection";

export async function clearVacancysCache(): Promise<number> {
    let cursor = "0";
    let deletedCount = 0;

    await redis.unlink("vacancysadmin:list");

    do {
        const [nextCursor, keys] = await redis.scan(
            cursor,
            "MATCH",
            "vacancys:*",
            "COUNT",
            1000
        );

        cursor = nextCursor;

        if (keys.length > 0) {
            console.log(keys)
            await redis.unlink(...keys);
            deletedCount += keys.length;
        }
    } while (cursor !== "0");

    return deletedCount;
}