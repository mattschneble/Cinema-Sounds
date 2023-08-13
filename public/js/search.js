const search = async () => {
    try {
      const response = await fetch('/api/movie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // Handle the successful response
        console.log('Request successful');
      } else {
        // Handle non-successful response
        console.log('Request failed with status:', response.status);
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  };
  
  document.querySelector('#searchButton').addEventListener('click', search);
  