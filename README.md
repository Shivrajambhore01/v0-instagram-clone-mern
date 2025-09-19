# Instagram Clone - DBMS Project

A full-stack Instagram-like social media application built with the MERN stack (MongoDB Atlas, Express.js, React.js, Node.js) for educational purposes, focusing on database management and data flow demonstration.

## Features

### User Management
- ✅ User registration and login with secure password hashing (bcrypt)
- ✅ JWT-based authentication with HTTP-only cookies
- ✅ User profiles with username, name, bio, and profile pictures
- ✅ User search functionality

### Post Management
- ✅ Create posts with image URLs and captions
- ✅ View posts in feed and explore sections
- ✅ Delete own posts
- ✅ Post search by caption

### Social Features
- ✅ Follow/unfollow users
- ✅ View followers and following lists
- ✅ Like/unlike posts with real-time updates
- ✅ Comment on posts with character limits
- ✅ Delete own comments or comments on own posts

### Feed System
- ✅ Personalized feed showing posts from followed users
- ✅ Explore feed with popular posts from unfollowed users
- ✅ Pagination for all feeds and lists

### Database Design
- ✅ Mongoose schemas with proper indexing for performance
- ✅ Balanced approach between embedding (likes, comments) and referencing (user relationships)
- ✅ Optimized queries with population for related data

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Styling**: Tailwind CSS with custom design system

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get single post
- `DELETE /api/posts/[id]` - Delete post
- `POST /api/posts/[id]/like` - Like post
- `DELETE /api/posts/[id]/like` - Unlike post

### Comments
- `GET /api/posts/[id]/comments` - Get post comments
- `POST /api/posts/[id]/comments` - Add comment
- `DELETE /api/posts/[id]/comments/[commentId]` - Delete comment

### Users & Social
- `GET /api/users/[username]` - Get user profile
- `GET /api/users/[username]/posts` - Get user posts
- `POST /api/users/[username]/follow` - Follow user
- `DELETE /api/users/[username]/follow` - Unfollow user
- `GET /api/users/[username]/followers` - Get followers
- `GET /api/users/[username]/following` - Get following

### Feed & Discovery
- `GET /api/feed` - Get personalized feed
- `GET /api/explore` - Get explore feed
- `GET /api/search` - Search users and posts

## Database Schema

### User Model
\`\`\`javascript
{
  username: String (unique, indexed),
  email: String (unique, indexed),
  password: String (hashed),
  name: String,
  bio: String,
  profilePicture: String,
  followers: [ObjectId] (indexed),
  following: [ObjectId] (indexed),
  posts: [ObjectId]
}
\`\`\`

### Post Model
\`\`\`javascript
{
  author: ObjectId (indexed),
  imageUrl: String,
  caption: String,
  likes: [{
    user: ObjectId,
    createdAt: Date
  }],
  comments: [{
    user: ObjectId,
    text: String,
    createdAt: Date
  }],
  likesCount: Number,
  commentsCount: Number,
  createdAt: Date (indexed)
}
\`\`\`

### Follow Model
\`\`\`javascript
{
  follower: ObjectId (indexed),
  following: ObjectId (indexed),
  createdAt: Date
}
\`\`\`

## Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd instagram-clone
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Variables**
   Create a `.env.local` file with:
   \`\`\`
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   \`\`\`

4. **Seed the database** (optional)
   \`\`\`bash
   npm run seed
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open the application**
   Navigate to `http://localhost:3000`

## Testing with Postman

The API can be tested using Postman with the provided endpoints. Authentication is required for most endpoints - use the login endpoint to get a JWT token in cookies.

## Educational Value

This project demonstrates:
- **Database Design**: Proper schema design with indexing strategies
- **Data Relationships**: One-to-many and many-to-many relationships
- **Query Optimization**: Efficient database queries with population
- **Authentication**: Secure user authentication and authorization
- **API Design**: RESTful API design principles
- **Full-Stack Integration**: Complete data flow from frontend to database

## Future Enhancements

- Real-time notifications
- Image upload functionality
- Story features
- Direct messaging
- Advanced search filters
- Content moderation
- Analytics dashboard

---

Built for educational purposes to demonstrate database management concepts and full-stack development with the MERN stack.
