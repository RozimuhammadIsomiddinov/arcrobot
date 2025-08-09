import ImagePosition from "../../models/imageposition";

const createImagePosition = async (data) => {
  const { title, top, left_pos, image } = data;
  return await ImagePosition.create({});
};
const selectImagePosition = async();
