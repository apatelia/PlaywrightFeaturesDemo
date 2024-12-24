import { test, expect } from "@playwright/test";

const host = "https://restful-booker.herokuapp.com";
let token: string;
let bookingId: number;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ request }) => {
  // Get authentication token before making any other API requests.
  // We need authentication token for DELETE request.
  const response = await request.post(host + '/auth', {
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      'username': 'admin',
      'password': 'password123'
    }
  });

  const jsonBody = await response.json();

  // Store authentication token for use in future requests.
  token = jsonBody.token;
});

test('Create a new booking @api', async ({ request }) => {
  // Create booking for Jim using POST.
  const response = await request.post(host + '/booking/', {
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      'firstname': 'Jim',
      'lastname': 'Brown',
      'totalprice': 111,
      'depositpaid': true,
      'bookingdates': {
        'checkin': '2023-04-01',
        'checkout': '2023-04-30'
      },
      'additionalneeds': 'Breakfast'
    }
  });

  expect(response.status()).toEqual(200);

  const jsonBody = await response.json();
  expect(jsonBody.bookingid).toBeDefined();

  // Store booking id for fetching the booking.
  bookingId = jsonBody.bookingid;
});

test('Retrieve booking for Jim @api', async ({ request }) => {
  test.skip(bookingId == undefined, "Can not retrieve an undefined booking.");

  // Retrieve booking information using GET.
  const response = await request.get(host + '/booking/' + bookingId, {
    headers: {
      'Accept': 'application/json'
    }
  });

  expect(response.status()).toEqual(200);

  const jsonBody = await response.json();

  // Verify that booking is for Jim.
  expect(jsonBody.firstname).toBe('Jim');
});

test('Delete booking for Jim @api', async ({ request }) => {
  test.skip(bookingId == undefined, "Can not delete a non-existent booking.");

  // Cancel booking using DELETE.
  const response = await request.delete(host + '/booking/' + bookingId, {
    headers: {
      'Accept': 'application/json',
      'Cookie': 'token=' + token
    }
  });

  // Verify if the booking was deleted successfully or not.
  expect(response.status()).toEqual(201);
});
