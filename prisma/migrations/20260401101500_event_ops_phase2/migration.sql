-- CreateEnum
CREATE TYPE "CheckInAttemptOutcome" AS ENUM ('SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "CheckInAttemptSource" AS ENUM ('CAMERA', 'MANUAL', 'OFFLINE_SYNC', 'API');

-- CreateEnum
CREATE TYPE "CheckInQueueState" AS ENUM ('PENDING', 'CONFLICT', 'SYNCED');

-- CreateEnum
CREATE TYPE "OnsiteIncidentSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "OnsiteIncidentStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED');

-- CreateTable
CREATE TABLE "EventBadgePrintLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "printerLabel" TEXT,
    "note" TEXT,
    "eventId" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "printedById" TEXT,

    CONSTRAINT "EventBadgePrintLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCheckInAttempt" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outcome" "CheckInAttemptOutcome" NOT NULL,
    "source" "CheckInAttemptSource" NOT NULL DEFAULT 'MANUAL',
    "reasonCode" TEXT,
    "note" TEXT,
    "location" TEXT,
    "deviceLabel" TEXT,
    "eventId" TEXT NOT NULL,
    "registrationId" TEXT,
    "actorId" TEXT,

    CONSTRAINT "EventCheckInAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTicketRecoveryCode" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "attendeeEmail" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,

    CONSTRAINT "EventTicketRecoveryCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCheckInQueueItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "queuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" "CheckInQueueState" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "qrPayload" TEXT NOT NULL,
    "location" TEXT,
    "deviceLabel" TEXT,
    "source" "CheckInAttemptSource" NOT NULL DEFAULT 'OFFLINE_SYNC',
    "processedAt" TIMESTAMP(3),
    "eventId" TEXT NOT NULL,
    "createdById" TEXT,
    "processedById" TEXT,

    CONSTRAINT "EventCheckInQueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventOnsiteIncident" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "OnsiteIncidentSeverity" NOT NULL DEFAULT 'MEDIUM',
    "status" "OnsiteIncidentStatus" NOT NULL DEFAULT 'OPEN',
    "detail" TEXT,
    "location" TEXT,
    "deviceLabel" TEXT,
    "occurredAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "resolutionNote" TEXT,
    "eventId" TEXT NOT NULL,
    "createdById" TEXT,
    "resolvedById" TEXT,

    CONSTRAINT "EventOnsiteIncident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventBadgePrintLog_eventId_createdAt_idx" ON "EventBadgePrintLog"("eventId", "createdAt");

-- CreateIndex
CREATE INDEX "EventBadgePrintLog_registrationId_createdAt_idx" ON "EventBadgePrintLog"("registrationId", "createdAt");

-- CreateIndex
CREATE INDEX "EventCheckInAttempt_eventId_createdAt_idx" ON "EventCheckInAttempt"("eventId", "createdAt");

-- CreateIndex
CREATE INDEX "EventCheckInAttempt_outcome_createdAt_idx" ON "EventCheckInAttempt"("outcome", "createdAt");

-- CreateIndex
CREATE INDEX "EventCheckInAttempt_source_createdAt_idx" ON "EventCheckInAttempt"("source", "createdAt");

-- CreateIndex
CREATE INDEX "EventTicketRecoveryCode_eventId_attendeeEmail_createdAt_idx" ON "EventTicketRecoveryCode"("eventId", "attendeeEmail", "createdAt");

-- CreateIndex
CREATE INDEX "EventTicketRecoveryCode_registrationId_createdAt_idx" ON "EventTicketRecoveryCode"("registrationId", "createdAt");

-- CreateIndex
CREATE INDEX "EventCheckInQueueItem_eventId_state_queuedAt_idx" ON "EventCheckInQueueItem"("eventId", "state", "queuedAt");

-- CreateIndex
CREATE INDEX "EventCheckInQueueItem_eventId_createdAt_idx" ON "EventCheckInQueueItem"("eventId", "createdAt");

-- CreateIndex
CREATE INDEX "EventOnsiteIncident_eventId_createdAt_idx" ON "EventOnsiteIncident"("eventId", "createdAt");

-- CreateIndex
CREATE INDEX "EventOnsiteIncident_eventId_status_severity_idx" ON "EventOnsiteIncident"("eventId", "status", "severity");

-- AddForeignKey
ALTER TABLE "EventBadgePrintLog" ADD CONSTRAINT "EventBadgePrintLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventBadgePrintLog" ADD CONSTRAINT "EventBadgePrintLog_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "EventRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventBadgePrintLog" ADD CONSTRAINT "EventBadgePrintLog_printedById_fkey" FOREIGN KEY ("printedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCheckInAttempt" ADD CONSTRAINT "EventCheckInAttempt_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCheckInAttempt" ADD CONSTRAINT "EventCheckInAttempt_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "EventRegistration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCheckInAttempt" ADD CONSTRAINT "EventCheckInAttempt_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTicketRecoveryCode" ADD CONSTRAINT "EventTicketRecoveryCode_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTicketRecoveryCode" ADD CONSTRAINT "EventTicketRecoveryCode_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "EventRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCheckInQueueItem" ADD CONSTRAINT "EventCheckInQueueItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCheckInQueueItem" ADD CONSTRAINT "EventCheckInQueueItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCheckInQueueItem" ADD CONSTRAINT "EventCheckInQueueItem_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOnsiteIncident" ADD CONSTRAINT "EventOnsiteIncident_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOnsiteIncident" ADD CONSTRAINT "EventOnsiteIncident_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOnsiteIncident" ADD CONSTRAINT "EventOnsiteIncident_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
