import app from "./app";
import "dotenv/config";

const PORT = process.env.PORT as string;

app.listen(PORT, () => {
    console.log(`HTTP Server is running on port ${PORT}`);
});