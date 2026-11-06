import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGoalIds, GOAL_ID_COLUMNS } from './goalIds.js';

const FORM_ID = '421730000000000';

test('every filled goal gets the form ID plus its goal number', () => {
  const goals = { goalOne: 'a', goalTwo: 'b', goalThree: 'c', goalFour: 'd', goalFive: 'e' };

  assert.deepEqual(buildGoalIds(FORM_ID, goals), {
    goal_1_id: '421730000000000-G1',
    goal_2_id: '421730000000000-G2',
    goal_3_id: '421730000000000-G3',
    goal_4_id: '421730000000000-G4',
    goal_5_id: '421730000000000-G5',
  });
});

test('blank, whitespace-only and missing goals get no ID', () => {
  const goals = { goalOne: 'a', goalTwo: '', goalThree: '   \n ', goalFour: null };

  assert.deepEqual(buildGoalIds(FORM_ID, goals), {
    goal_1_id: '421730000000000-G1',
    goal_2_id: '',
    goal_3_id: '',
    goal_4_id: '',
    goal_5_id: '',
  });
});

test('goal numbers follow the slot and are not renumbered across gaps', () => {
  const ids = buildGoalIds(FORM_ID, { goalOne: 'a', goalThree: 'c', goalFive: 'e' });

  assert.equal(ids.goal_1_id, '421730000000000-G1');
  assert.equal(ids.goal_2_id, '');
  assert.equal(ids.goal_3_id, '421730000000000-G3');
  assert.equal(ids.goal_4_id, '');
  assert.equal(ids.goal_5_id, '421730000000000-G5');
});

test('rewording a goal keeps its ID', () => {
  const before = buildGoalIds(FORM_ID, { goalOne: 'Learn R', goalTwo: 'Present well' });
  const after = buildGoalIds(FORM_ID, { goalOne: 'Learn Python instead', goalTwo: 'Present well' });

  assert.deepEqual(after, before);
});

test('a leading zero in the form ID is kept', () => {
  const ids = buildGoalIds('071730000000000', { goalOne: 'a' });

  assert.equal(ids.goal_1_id, '071730000000000-G1');
});

test('a form with no goals section produces five blank IDs', () => {
  const ids = buildGoalIds(FORM_ID, undefined);

  assert.deepEqual(Object.keys(ids), GOAL_ID_COLUMNS);
  assert.ok(Object.values(ids).every((id) => id === ''));
});
