-- CreateTable
CREATE TABLE `DiscordChallenge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `did` VARCHAR(191) NOT NULL,
    `discordUsername` VARCHAR(191) NOT NULL,
    `discordAvatar` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `challengeCode` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DiscordChallenge_did_key`(`did`),
    UNIQUE INDEX `DiscordChallenge_challengeCode_key`(`challengeCode`),
    UNIQUE INDEX `DiscordChallenge_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `discord` VARCHAR(191) NOT NULL,
    `discordAvatar` VARCHAR(191) NOT NULL,
    `did` VARCHAR(191) NOT NULL,
    `didSession` TEXT NOT NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_discord_key`(`discord`),
    UNIQUE INDEX `User_did_key`(`did`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Community` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discordId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Community_discordId_key`(`discordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Thread` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discordId` VARCHAR(191) NOT NULL,
    `streamId` VARCHAR(191) NOT NULL,
    `discordAuthor` VARCHAR(191) NOT NULL,
    `discordCommunity` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Thread_discordId_key`(`discordId`),
    UNIQUE INDEX `Thread_streamId_key`(`streamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discordId` VARCHAR(191) NOT NULL,
    `streamId` VARCHAR(191) NOT NULL,
    `discordAuthor` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `threadId` INTEGER NOT NULL,

    UNIQUE INDEX `Comment_discordId_key`(`discordId`),
    UNIQUE INDEX `Comment_streamId_key`(`streamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_threadId_fkey` FOREIGN KEY (`threadId`) REFERENCES `Thread`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
