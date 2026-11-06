// Per-goal IDs for the goal setting form CSV export.
//
// A goal's ID is its form's _id plus its slot number, e.g. 421730000000000-G3.
// IDs are worked out each time the CSV is generated and are never stored. They
// belong to the slot, not the wording: rewriting a goal keeps its ID, and slots
// are not renumbered when an earlier goal is blank (goals 1, 3, 5 give G1, G3, G5).

const GOAL_FIELDS = ['goalOne', 'goalTwo', 'goalThree', 'goalFour', 'goalFive'];

export const GOAL_ID_COLUMNS = GOAL_FIELDS.map((_, index) => `goal_${index + 1}_id`);

// Returns { goal_1_id, ..., goal_5_id }. Blank goals get ''. Whitespace-only text
// counts as blank, matching the goal form's own validation.
export function buildGoalIds(formId, goals) {
  const ids = {};
  GOAL_FIELDS.forEach((field, index) => {
    const text = goals?.[field];
    const isFilled = typeof text === 'string' && text.trim() !== '';
    ids[GOAL_ID_COLUMNS[index]] = isFilled ? `${formId}-G${index + 1}` : '';
  });
  return ids;
}
