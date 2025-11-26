export default class GeniusEngine {
  
  constructor() {
    this.version = "1.0.0";
    this.engine = "GENIUS Quantum Engine";
  }

  analyzeMatch(input) {
    try {
      const { teamA, teamB, stats } = input;

      const score =
        (stats.possessionA * 0.2) +
        (stats.xgA * 0.35) +
        (stats.formA * 0.25) +
        (stats.shotsOnTargetA * 0.2) -
        ((stats.possessionB * 0.2) +
         (stats.xgB * 0.35) +
         (stats.formB * 0.25) +
         (stats.shotsOnTargetB * 0.2));

      let prediction = "";

      if (score > 0.25) prediction = `${teamA} likely wins`;
      else if (score < -0.25) prediction = `${teamB} likely wins`;
      else prediction = "Tight match, possible draw";

      return {
        engine: this.engine,
        version: this.version,
        confidence: Math.min(98, 70 + Math.abs(score) * 30),
        result: prediction,
      };

    } catch (err) {
      return {
        error: true,
        message: "GENIUS ENGINE INTERNAL ERROR",
      };
    }
  }
}
