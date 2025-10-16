type DifficultyFactors = {
  depth: number;
  knowledge: number;
  steps: number;
  environment: number;
  obfuscation: number;
  tools: number;
};

type DifficultyResult = {
  difficultyScore: number;
  label: "Easy" | "Medium" | "Hard" | "Insane";
  points: number;
};

/**
 * Calculate challenge difficulty and points (max 250)
 * @param factors Difficulty factors (0–5 each)
 * @param continuous Optional: continuous scaling (true = smooth 50–250)
 */
export function calculateDifficulty(
  factors: DifficultyFactors,
  continuous: boolean = false
): DifficultyResult {
  const { depth, knowledge, steps, environment, obfuscation, tools } = factors;

  const difficultyScore =
    ((depth + knowledge + steps + environment + obfuscation + tools) / 30) *
    100;

  let label: DifficultyResult["label"];
  let points: number;

  if (continuous) {
    // Linear scale between 50 and 250
    points = Math.round(50 + (difficultyScore / 100) * 200);
  } else {
    if (difficultyScore <= 25) {
      label = "Easy";
      points = 75;
    } else if (difficultyScore <= 50) {
      label = "Medium";
      points = 150;
    } else if (difficultyScore <= 75) {
      label = "Hard";
      points = 210;
    } else {
      label = "Insane";
      points = 250;
    }
    return { difficultyScore: Math.round(difficultyScore), label, points };
  }

  if (difficultyScore <= 25) label = "Easy";
  else if (difficultyScore <= 50) label = "Medium";
  else if (difficultyScore <= 75) label = "Hard";
  else label = "Insane";

  return { difficultyScore: Math.round(difficultyScore), label, points };
}

// Example test
if (require.main === module) {
  console.log(
    calculateDifficulty(
      {
        depth: 4,
        knowledge: 5,
        steps: 4,
        environment: 3,
        obfuscation: 4,
        tools: 2,
      },
      true
    )
  );
}
