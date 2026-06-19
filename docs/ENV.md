Environment Variable Documentation
---------------------------------
Backend (.env)
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=project_management
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

NODE_ENV=development
----------------------------
Variable Description
---------------------------
PORT	Backend server port
DB_HOST	MySQL host
DB_PORT	MySQL port
DB_NAME	Database name
DB_USER	Database username
DB_PASSWORD	Database password
JWT_SECRET	Secret key used for JWT token generation
JWT_EXPIRES_IN	Token expiration duration
NODE_ENV	Application environment
Frontend (.env)
VITE_API_URL=http://localhost:5000/api
Variable Description
Variable	Description
VITE_API_URL	Backend API base URL
-------------------------
For production deployment:
----------------------------
VITE_API_URL=https://your-backend-domain.com/api