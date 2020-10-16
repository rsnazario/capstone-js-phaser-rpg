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

  test('Does not change if all scores are equal (Do not change order based on user name', () => {
    const mockedResponse = [
      { user: 'AAAA', score: 100 },
      { user: 'EEEE', score: 100 },
      { user: 'IIII', score: 100 },
      { user: 'OOOO', score: 100 },
      { user: 'UUUU', score: 100 },
    ];
    const result = scoreboard.orderedScores(mockedResponse);

    expect(result).toEqual(mockedResponse);
  });

  test('Empty Data', () => {
    const mockedResponse = [];

    const result = scoreboard.orderedScores(mockedResponse);

    expect(result).toEqual([]);
  });
});