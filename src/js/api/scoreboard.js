const key = 't82Jd3rsSodrA4KcbQ65'
import axios from 'axios';

const scoreboard = (() => {

  const getScore = () => new Promise((resolve, reject) => {
    console.log('getScore');
    const url = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${key}/scores`;
    axios.get(url).then((res) => {
      resolve(res.data.result);
    }).catch((error) => {
      reject(error.message);
    });
  });

  const setScore = (user, score) => new Promise((resolve, reject) => {
    console.log('setScore');
    const url = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${key}/scores/`;
    axios.post(url, { user, score }).then((res) => {
      resolve(res.data.result);
    }).catch((error) => {
      reject(error);
    });
  });


  return {
    getScore,
    setScore,
  };
})();

export default scoreboard;