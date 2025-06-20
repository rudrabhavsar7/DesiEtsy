import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    tagline: {
        type: String,
        required: true
    },
})

categoriesSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getFilter());

  console.log(doc);
  if (doc) {
    await Subcategory.deleteMany({ category: doc.path });
    console.log(`Subcategories for Category '${doc.title}' deleted`);
  }

  next();
});

export const Category =  mongoose.model("Category", categoriesSchema);

const subcategoriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        ref: "Category"
    }
})

export const Subcategory =  mongoose.model("Subcategory", subcategoriesSchema);