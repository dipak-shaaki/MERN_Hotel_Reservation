import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";
import { createTransporter, emailTemplates } from "../config/emailConfig.js";

const send_reservation = async (req, res, next) => {
  const { firstName, lastName, email, date, time, phone } = req.body;
  if (!firstName || !lastName || !email || !date || !time || !phone) {
    return next(new ErrorHandler("Please Fill Full Reservation Form!", 400));
  }

  try {
    // Create the reservation
    const reservation = await Reservation.create({ firstName, lastName, email, date, time, phone });

    // Send confirmation email to customer
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = createTransporter();

        // Send confirmation to customer
        const customerMailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          ...emailTemplates.reservationConfirmation(`${firstName} ${lastName}`, { date, time })
        };

        // Send notification to restaurant
        const restaurantMailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.RESTAURANT_EMAIL || process.env.EMAIL_USER,
          ...emailTemplates.reservationNotification({ firstName, lastName, email, phone, date, time })
        };

        // Send emails asynchronously
        await Promise.all([
          transporter.sendMail(customerMailOptions),
          transporter.sendMail(restaurantMailOptions)
        ]);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the reservation if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
      reservationId: reservation._id
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return next(new ErrorHandler(validationErrors.join(', '), 400));
    }

    // Handle other errors
    return next(error);
  }
};

export default send_reservation;