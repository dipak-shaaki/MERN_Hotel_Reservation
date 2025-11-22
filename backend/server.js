import app from "./app.js";

// For local development
if (process.env.NODE_ENV !== "production") {
    app.listen(process.env.PORT, () => {
        console.log(`SERVER HAS STARTED AT PORT ${process.env.PORT}`);
    });
}

// For Vercel serverless
export default app;
