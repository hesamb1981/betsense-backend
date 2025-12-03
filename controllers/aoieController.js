// controllers/aoie/aoieController.js
// ------------------------------------
// AOIE Controller + STI Trainer bridge

import { computeAoieScores } from "../../aoie/aoieEngine.js";
import { trainAoieSti } from "../../sti/sti.trainer.js";

// سلامت AOIE
export const aoieHealth = (req, res) => {
  return res.json({
    ok: true,
    message: "AOIE Engine mounted on main backend ✔️"
  });
};

// تست AOIE با یک ورودی دمو
export const aoieTest = (req, res) => {
  const match = {
    matchId: "M-ARS-TOT-2025-01-05",
    league: "EPL",
    kickoffTime: "2025-01-05T16:30:00Z",
    homeTeam: "Arsenal",
    awayTeam: "Tottenham"
  };

  const dataspin = {
    tisScore: 71.8,
    tisPatternType: "mid_press",
    nonEventPressureScore: 69.1,
    behaviorEntropyHome: 47.2,
    behaviorEntropyAway: 52.3,
    matchChaosIndex: 51.4,
    clubSfiHome: 63.5,
    clubSfiAway: 58.9
  };

  const markets = [
    {
      marketId: "MKT-1X2-FT",
      marketCode: "1X2",
      line: "FT",
      stakes: {
        HOME: 120000,
        DRAW: 80000,
        AWAY: 95000
      },
      odds: {
        HOME: 1.95,
        DRAW: 3.6,
        AWAY: 3.8
      }
    },
    {
      marketId: "MKT-OU-2_5",
      marketCode: "OU",
      line: "2.5",
      stakes: {
        OVER: 87000,
        UNDER: 91000
      },
      odds: {
        OVER: 1.9,
        UNDER: 1.9
      }
    }
  ];

  const tickets = [
    {
      ticketId: "T1",
      marketId: "MKT-1X2-FT",
      selectionCode: "HOME",
      stake: 50000,
      customerSegment: "public"
    },
    {
      ticketId: "T2",
      marketId: "MKT-1X2-FT",
      selectionCode: "HOME",
      stake: 30000,
      customerSegment: "sharp"
    },
    {
      ticketId: "T3",
      marketId: "MKT-OU-2_5",
      selectionCode: "OVER",
      stake: 45000,
      customerSegment: "public"
    },
    {
      ticketId: "T4",
      marketId: "MKT-OU-2_5",
      selectionCode: "UNDER",
      stake: 30000,
      customerSegment: "sharp"
    }
  ];

  const result = computeAoieScores({ match, markets, dataspin, tickets });

  return res.json({
    ok: true,
    matchId: match.matchId,
    ...result
  });
};

// ------------------------------
// آموزش AOIE از طریق STI Trainer
// ------------------------------

export const aoieTrain = (req, res) => {
  const matchId = req.query.matchId || "TRAIN-DEMO-1";
  const scoreParam = req.query.score;
  const correctnessScore =
    scoreParam !== undefined ? Number(scoreParam) : 0.5;

  const trainerResult = trainAoieSti({
    matchId,
    correctnessScore
  });

  return res.json({
    ok: true,
    received: {
      matchId,
      correctnessScore: isNaN(correctnessScore) ? null : correctnessScore
    },
    trainer: trainerResult
  });
};
