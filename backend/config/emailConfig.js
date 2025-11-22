import nodemailer from 'nodemailer';


const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Email templates
const emailTemplates = {
    reservationConfirmation: (customerName, reservationDetails) => {
        return {
            subject: 'Reservation Confirmation - Golden Palace Restaurant',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4af37; text-align: center;">Golden Palace Restaurant</h2>
          <h3>Reservation Confirmation</h3>
          <p>Dear ${customerName},</p>
          <p>Thank you for making a reservation at Golden Palace Restaurant. Here are your reservation details:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Date:</strong> ${reservationDetails.date}</p>
            <p><strong>Time:</strong> ${reservationDetails.time}</p>
            <p><strong>Number of Guests:</strong> ${reservationDetails.guests || 'Not specified'}</p>
          </div>
          
          <p>We look forward to serving you!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p><strong>Golden Palace Restaurant</strong></p>
            <p>Kathmandu, Nepal</p>
            <p>Phone: +977-XXXXXXXXX</p>
          </div>
        </div>
      `
        };
    },

    reservationNotification: (reservationDetails) => {
        return {
            subject: 'New Reservation - Golden Palace Restaurant',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4af37;">New Reservation Received</h2>
          <p>A new reservation has been made at Golden Palace Restaurant. Here are the details:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Customer Name:</strong> ${reservationDetails.firstName} ${reservationDetails.lastName}</p>
            <p><strong>Email:</strong> ${reservationDetails.email}</p>
            <p><strong>Phone:</strong> ${reservationDetails.phone}</p>
            <p><strong>Date:</strong> ${reservationDetails.date}</p>
            <p><strong>Time:</strong> ${reservationDetails.time}</p>
          </div>
          
          <p>Please ensure all details are correct and prepare accordingly.</p>
        </div>
      `
        };
    }
};

export { createTransporter, emailTemplates };