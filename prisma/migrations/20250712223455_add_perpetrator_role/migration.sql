-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "injured" INTEGER NOT NULL DEFAULT 0,
    "killed" INTEGER NOT NULL DEFAULT 0,
    "politicalParty" TEXT NOT NULL,
    "perpetratorRole" TEXT,
    "date" DATETIME NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "news_sources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastScraped" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "news_sources_url_key" ON "news_sources"("url");
