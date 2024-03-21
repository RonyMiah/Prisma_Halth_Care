-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "profilePhoto" DROP NOT NULL,
ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "needPasswordChange" SET DEFAULT true,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
