const search = async () => {
    try {
      const keyword = document.getElementById("movie-search").value;
      window.location.href = '/api/movie/search/' + keyword;

    } catch (err) {
      console.error('An error occurred:', err);
    }
  };
  
  document.querySelector('#searchButton').addEventListener('click', search);
  