-- AlterTable
ALTER TABLE `class_types` ADD COLUMN `external_id` VARCHAR(191) NULL,
    ADD COLUMN `external_metadata` JSON NULL,
    ADD COLUMN `external_source` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `instructor_profiles` ADD COLUMN `external_id` VARCHAR(191) NULL,
    ADD COLUMN `external_metadata` JSON NULL,
    ADD COLUMN `external_source` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `class_types_external_source_external_id_idx` ON `class_types`(`external_source`, `external_id`);

-- CreateIndex
CREATE INDEX `instructor_profiles_external_source_external_id_idx` ON `instructor_profiles`(`external_source`, `external_id`);
