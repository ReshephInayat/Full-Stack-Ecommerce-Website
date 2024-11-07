import { defineType } from "sanity";
export const HeroImagesType = defineType({
  name: "heroImages",
  title: "Hero Images",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "images",
    },
  },
});
