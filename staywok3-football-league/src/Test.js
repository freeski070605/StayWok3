import React, { useEffect } from 'react';
import api from './api';

const Test = () => {
  useEffect(() => {
    api.get('/')
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  return <div>Check the console for API response!</div>;
};

export default Test;
