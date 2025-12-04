Run the backend
npm run dev
add the ip in mongodb atlas

Run the Frontend
npm run build -if not yet
npx serve -s dist


.env for backend
PORT=5000
MONGO_URI=mongodb+srv://bluelock_db:4OTNwETG3aJdzg0S@cluster0.gmxczn9.mongodb.net/sports_pwa?retryWrites=true&w=majority
JWT_SECRET=your_strong_jwt_secret_key_here
JWT_EXPIRE=1d

GOOGLE_CLIENT_ID=1072803851394-qp5mh5gl2tvmjjr22udkjcuu26p4knpc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
