document.addEventListener('DOMContentLoaded', function () {
    const reviewForm = document.querySelector('.review-form form');
    const reviewsContainer = document.querySelector('.reviews');

    reviewForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const formData = new FormData(reviewForm);

      const response = await fetch('/api/review', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const reviewData = await response.json();

        // Append the new review to the reviews container
        const newReviewElement = document.createElement('div');
        newReviewElement.classList.add('single-review');
        newReviewElement.innerHTML = `
          <h3>${reviewData.name} - ${reviewData.rating} stars</h3>
          <p>${reviewData.content}</p>
        `;
        reviewsContainer.appendChild(newReviewElement);

        // Clear the form inputs
        reviewForm.reset();
      } else {
        console.error('Failed to submit review');
      }
    });
  });