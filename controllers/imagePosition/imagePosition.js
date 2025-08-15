import { createImagePosition, selectImagePosition } from "./model.js";

const createImagePositionCont = async (req, res) => {
  try {
    const data = req.body;

    if (!data.catalog_id || !data.image_url) {
      return res
        .status(400)
        .json({ message: "catalog_id va image_url majburiy" });
    }

    const newPosition = await createImagePosition(data);
    return res.status(201).json(newPosition);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const selectImagePositionByIDCont = async (req, res) => {
  try {
    const { image_url } = req.params;
    const position = await selectImagePosition(image_url);

    if (position.length == 0) {
      return res.status(404).json({ message: "Position not found" });
    }

    return res.status(200).json(position);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export { createImagePositionCont, selectImagePositionByIDCont };
