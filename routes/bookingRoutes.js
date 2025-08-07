import express from 'express';
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings } from '../controllers/bookingController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';


const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', requireAuth, createBooking);
bookingRouter.get('/user', requireAuth, getUserBookings);
bookingRouter.get('/hotel', requireAuth, getHotelBookings);

export default bookingRouter;
