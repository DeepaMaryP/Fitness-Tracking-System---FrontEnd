export function calculateUserProgress(user) {
  const { goal_type, starting_weight, latest_weight, target_weight } = user;
  let progress = 0;

  if (goal_type === "Weight Loss") {
    progress = ((starting_weight - latest_weight) / (starting_weight - target_weight)) * 100;
  } else if (goal_type === "Weight Gain") {
    progress = ((latest_weight - starting_weight) / (target_weight - starting_weight)) * 100;
  } else if (goal_type === "Maintain") {
    progress = 100 - (Math.abs(latest_weight - starting_weight) / starting_weight) * 100;
  }
  
  return Math.min(100, Math.max(0, Math.round(progress)));
}
