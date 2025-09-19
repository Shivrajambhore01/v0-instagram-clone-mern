import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      maxlength: 2200,
      default: "",
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for performance
postSchema.index({ author: 1, createdAt: -1 })
postSchema.index({ createdAt: -1 })
postSchema.index({ "likes.user": 1 })

// Update likes count when likes array changes
postSchema.pre("save", function (next) {
  this.likesCount = this.likes.length
  this.commentsCount = this.comments.length
  next()
})

export default mongoose.models.Post || mongoose.model("Post", postSchema)
