// review.js

document.addEventListener('DOMContentLoaded', () => {
  const reviewForm = document.querySelector('#reviewForm');
  const movieIdInput = document.querySelector('#movieId');
  const nameInput = document.querySelector('#name');
  const ratingInput = document.querySelector('#rating');
  const reviewInput = document.querySelector('#review');

  const newReview = async (event) => {
    event.preventDefault();

    const movieId = movieIdInput.value;
    const name = nameInput.value;
    const rating = ratingInput.value;
    const content = reviewInput.value;

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        body: JSON.stringify({ movie_id: movieId, name, rating, content }),
        headers: { 'Content-Type': 'application/json' },
      });
        reviewForm.reset();
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
    reviewForm.reset();
  };

  reviewForm.addEventListener('submit', newReview);
});

