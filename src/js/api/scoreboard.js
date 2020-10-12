const key = 't82Jd3rsSodrA4KcbQ65'

const scoreboard = (() => {
  const getScore = async () => {
    const response = await fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${key}/scores`, {
      method: 'GET',
      mode: 'cors',
    });
    const result = await response.json();
    return result;
  };

  // const setScore = async (name, score) {
  //   const response = await fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${key}/scores`, {
  //     method: 'POST',
  //     mode: 'cors',
  //     body: JSON.stringify( {user: name, score: score } ),
  //   });
  //   const result = await response.json();

  // }

  // const setScore = async (name, score) {
  //   const response = await fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${key}/scores`, {
  //     method: 'POST',
  //     mode: 'cors',
  //     headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  //     body: JSON.stringify( { user: name, score } ),
  //   });

  //   if (response.status === 400) {
  //     throw new Error('You Need your name to send');
  //   }

  //   return response.json();
  // }

  return {
    getScore, 
    // setScore
  };
})();

export default scoreboard;