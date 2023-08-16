const FormEl = document.querySelector('#reviewForm')
const movieId = document.querySelector('#movieId')
const ratingInput = document.querySelector('#rating')
const reviewInput = document.querySelector('#review')



const newReview = async (event) => {
event.preventDefault();
try{
   const rating = ratingInput.value
    const content = reviewInput.value
    console.log(content);
    const MovieId = movieId.value
    const response = await fetch('/api/review', {
        method: 'POST',
        body: JSON.stringify({ rating, content, movie_id: MovieId }),
        headers: { 'Content-Type': 'application/json' },
      });
       console.log(response);
       form.reset();
}
catch (err){
console.log(err);
}
      
}

FormEl.addEventListener('submit', newReview);