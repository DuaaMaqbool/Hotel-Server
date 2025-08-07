import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

//Function to Check Availibility of Room
// const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
//   try {
//     console.log('Checking availability for room:', room, 'from', checkInDate, 'to', checkOutDate);
//     const bookings = await Booking.find({
//       room,
//       checkInDate: { $lte: checkOutDate },
//       checkOutDate: { $gte: checkInDate },
//     });
//     console.log('Bookings found (full data):', JSON.stringify(bookings, null, 2));
//     const isAvailable = bookings.length === 0;
//     return isAvailable;
//   } catch (error) {
//     console.error(error.message);
//   }
// };
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
      // 1. **NEW:** Check for a valid date range first
    if (new Date(checkInDate) > new Date(checkOutDate)) {
      return false; // Return false immediately for an invalid range
    }
    console.log('Checking availability for room:', room, 'from', checkInDate, 'to', checkOutDate);
    const bookings = await Booking.find({ 
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    console.log('Bookings found (full data):', JSON.stringify(bookings, null, 2));
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.error(error.message);
    return false; // Return false on error
  }
};

//API To check Avalability of room
//POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, room } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//API to create a new Booking
//POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, room, guests } = req.body;
    const user = req.user._id;

    //Before Booking Check availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });
    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not Available" });
    }
    //Get totalPrice based on nights
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    //Calculate totalPrice based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });
    res.json({ success: true, message: "Booking Created Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to create Booking" });
  }
};

//API to get all Bookings for a User
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "failed to fetch Bookings" });
  }
};

//API to get bookings for a hotel
//GET /api/bookings/hotel

export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "No hotel found." });
    }
    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    //Total Bookings
    const totalBookings = bookings.length;
    //Total revenue
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    
    res.json({
      success: false,
      message: "Failed to get booking"
    });
  }
};
