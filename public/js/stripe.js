/* eslint-disable */

const stripe = Stripe(
  "pk_test_51L5QazJn65wf4MRjP72f4U0q2ooty5jgpiWGcEKOu6StxJbsZRgEnWKTaPw5SAtEKNgEfbJrXh92blipewMxJfYt00VyHrQnrs",
);

const bookTour = async (tourId) => {
  try {
    // 1 - get checkoiut session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );
    // 2 - create checkout form + charge the credit card
    window.location.href = session.data.session.url;
  } catch (error) {
    showAlert();
  }
};
