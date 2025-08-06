import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";

//API to create a new room for a hotel
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const hotel = await Hotel.findOne({ owner: req.user._id });

    if (!hotel) return res.status(404).json({ success: false, message: "No Hotel Found" });

    //upload images to cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });
    //wait for all uploads to complete
    const images = await Promise.all(uploadImages);

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });
    res.status(201).json({ success: true, message: "Room created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//API to get all rooms/ populate is like an sql join operation in a no sql db
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({isAvailable: true}).populate({
      path:"hotel",
      populate:{
        path:"owner",
        select:"image"
      }
    }).sort({createdAt: -1})
     res.status(200).json({ success: true, rooms });
  } catch (error) {
     res.status(500).json({ success: false, message: error.message || "Server error fetching rooms." });
  }
};

//API to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData= await Hotel.findOne({owner: req.user._id});
    // 2. Handle case where no hotel is found for the owner
    if (!hotelData) {
      return res.status(404).json({ success: false, message: "No hotel found for this owner." });
    }
    const rooms= await Room.find({hotel: hotelData._id.toString()}).populate("hotel");
    res.status(200).json({ success: true, rooms });
  } catch (error) {
    console.error("Error fetching owner rooms:", error); 
    res.status(500).json({ success: false, message: error.message || "Server error fetching owner rooms." });
  }
};

//API to toggle availibility fro a room
export const toggleRoomAvailability = async (req, res) => {
  try {
    const {roomId} = req.body;
    const roomData = await Room.findById(roomId);
     if (!roomData) {
      return res.status(404).json({ success: false, message: "Room not found." });
    }
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
     res.status(200).json({ success: true, message: "Room availability updated successfully." });
    
    
  } catch (error) {
    console.error("Error toggling room availability:", error); // Added console log for debugging
    res.status(500).json({ success: false, message: error.message || "Server error updating room availability." });
  }
};
