import { prisma } from "../src/lib/db";

async function test() {
    try {
        console.log("Checking DB connection...");
        const count = await (prisma.user as any).count();
        console.log("User count:", count);
    } catch (e) {
        console.error("DB test failed:", e);
    }
}

test();
