import scoreboard from '../../api/scoreboard';

const axios = require('axios');

const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/';
const key = 't82Jd3rsSodrA4KcbQ65';

jest.mock('axios');

describe('API Working', () => {
  test('API Fetches Results', () => {
    const mockedResponse = { data: { user: 'user', score: 10 } };
    axios.get.mockResolvedValue(mockedResponse);
    scoreboard.getScore();

    expect(axios.get).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalledWith(`${url}${key}/scores`);
  });
});

describe('API Helper: Reorder', () => {
  test('Reorder in Descending Order', () => {
    const mockedResponse = [
      { user: 'user1', score: 10 },
      { user: 'user2', score: 50 },
      { user: 'user3', score: 30 },
    ];
    const result = scoreboard.orderedScores(mockedResponse);
    const expectedResult = [
      { score: 50, user: 'user2' },
      { score: 30, user: 'user3' },
      { score: 10, user: 'user1' },
    ];

    expect(result).toEqual(expectedResult);
  });
});