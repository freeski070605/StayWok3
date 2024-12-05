import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MediaGallery() {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    axios.get('/api/content')
      .then((res) => setMedia(res.data))
      .catch((err) => console.error('Failed to fetch media:', err));
  }, []);

  return (
    <div>
      <h1>Media Gallery</h1>
      <ul>
        {media.map((item) => (
          <li key={item._id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <img src={item.mediaUrl} alt={item.title} style={{ width: '300px' }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MediaGallery;
