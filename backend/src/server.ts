import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// import app from "./app"; // ঠিক path
// import serverless from "serverless-http";


// export const handler = serverless(app); // ✅ Vercel use korbe eta
