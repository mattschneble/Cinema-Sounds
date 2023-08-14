const search = async () => {
    try {
      const keyword = document.getElementById("movie-search").value;

      window.location.href = '/api/movie/search/' + keyword;

      // const response = await fetch('/api/movie/search/' + keyword)
  
      // if (response.ok) {
      //   // Handle the successful response
      //   console.log('Request successful');

      //   const movieData = await response.json();


      //   console.log(movieData)
      // } else {
      //   // Handle non-successful response
      //   console.log('Request failed with status:', response.status);
      // }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  };
  
  document.querySelector('#searchButton').addEventListener('click', search);
  