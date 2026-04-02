import { prisma } from "@/lib/prisma";
import { VoteStatus } from "@prisma/client";

export async function evaluateVoteQuarantine(params: {
  ipHash: string;
  fingerprintHash: string | null;
}): Promise<{ quarantine: boolean; reason: string | null }> {
  const fpThreshold = Number(process.env.VOTE_QUARANTINE_FP_THRESHOLD ?? 2);
  const crossEntryIpThreshold = Number(process.env.VOTE_QUARANTINE_CROSS_ENTRY_IP_THRESHOLD ?? 8);

  const validIpVotesAcrossEntries = await prisma.publicVote.count({
    where: {
      status: VoteStatus.VALID,
      ipHash: params.ipHash,
    },
  });

  if (validIpVotesAcrossEntries >= crossEntryIpThreshold) {
    return {
      quarantine: true,
      reason: `IP has ${validIpVotesAcrossEntries} prior valid votes across entries (threshold ${crossEntryIpThreshold})`,
    };
  }

  if (params.fingerprintHash) {
    const fpAcross = await prisma.publicVote.count({
      where: {
        status: VoteStatus.VALID,
        fingerprintHash: params.fingerprintHash,
      },
    });
    if (fpAcross >= fpThreshold) {
      return {
        quarantine: true,
        reason: `Fingerprint has ${fpAcross} prior valid votes (threshold ${fpThreshold})`,
      };
    }
  }

  return { quarantine: false, reason: null };
}
