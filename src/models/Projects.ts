import mongoose from "mongoose";

const frameworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const projectsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      ref: "Category",
    },
    thumbnail: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: [String],
      default: [],
    },
    previewLink: {
      type: String,
      required: false,
    },
    frameworks: {
      type: [frameworkSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Add pre-save middleware to log the document
projectsSchema.pre("save", function (next) {
  next();
});

const Projects =
  mongoose.models.Projects ||
  mongoose.model(process.env.NEXT_PUBLIC_PROJECTS as string, projectsSchema);
export default Projects;
