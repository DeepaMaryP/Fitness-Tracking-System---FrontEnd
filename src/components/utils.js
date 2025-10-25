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

export const getFormattedDate = (cdate) => {
  const yyyy = cdate.getFullYear();
  const mm = String(cdate.getMonth() + 1).padStart(2, "0");
  const dd = String(cdate.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`
}

export const getFormattedDateToDisplay = (cdate) => {
  const cdateObj = new Date(cdate);
  return cdateObj.toISOString().split("T")[0];
}

export function calculateAge(dob) {  
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust if birthday hasn’t occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

