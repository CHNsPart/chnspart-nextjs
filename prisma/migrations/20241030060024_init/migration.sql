-- CreateTable
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'new'
);
