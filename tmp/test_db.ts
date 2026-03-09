import { prisma } from "../src/lib/db";

async function testConnection() {
    try {
        await prisma.$connect();
        console.log("Database connection successful!");
        const userCount = await prisma.user.count();
        console.log("User count:", userCount);
    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
