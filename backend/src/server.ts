import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// // backend/src/server.ts
// import app from "./app";

// //  Don't use app.listen()
// //  Instead, export the app for Vercel
// export default app;








