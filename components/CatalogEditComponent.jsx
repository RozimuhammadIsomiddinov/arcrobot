import React, { useState } from "react";
import { Box, Label, Button, Input, TextArea } from "@adminjs/design-system";
import axios from "axios";
import ReactJson from "react-json-view";

// JSONdagi qiymatlarni stringga aylantirish uchun helper
const convertValuesToString = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const key in copy) {
    if (copy[key] === null) {
      copy[key] = "";
    } else if (typeof copy[key] === "object") {
      copy[key] = convertValuesToString(copy[key]);
    } else {
      copy[key] = String(copy[key]);
    }
  }
  return copy;
};

const CatalogEditComponent = ({ record, onChange }) => {
  const [name, setName] = useState(record?.params?.name || "");
  const [title, setTitle] = useState(record?.params?.title || "");
  const [description, setDescription] = useState(
    record?.params?.description || ""
  );
  const [property, setProperty] = useState(() => {
    try {
      return record?.params?.property ? JSON.parse(record.params.property) : {};
    } catch {
      return {};
    }
  });

  // Eski rasmlar
  const [uploaded, setUploaded] = useState(() => {
    try {
      const imgs = record?.params?.images;
      if (!imgs) return [];
      return Array.isArray(imgs) ? imgs : JSON.parse(imgs);
    } catch {
      return [];
    }
  });

  const [inputs, setInputs] = useState([{ id: Date.now(), file: null }]);

  const safeOnChange = (field, value) => {
    if (typeof onChange === "function") {
      onChange(field, value);
    }
  };

  const handleFileChange = (index, file) => {
    const newInputs = [...inputs];
    newInputs[index].file = file;
    setInputs(newInputs);
  };

  const addInput = () => {
    if (inputs.length >= 10)
      return alert("Ko'pi bilan 10 ta rasm yuklashingiz mumkin!");
    setInputs([...inputs, { id: Date.now(), file: null }]);
  };

  const handleRemoveUploaded = (idx) => {
    const newUploaded = uploaded.filter((_, i) => i !== idx);
    setUploaded(newUploaded);
    safeOnChange("images", newUploaded);
  };

  const handleUpdate = async () => {
    const files = inputs.map((i) => i.file).filter(Boolean);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      formData.append("id", record?.params?.id);
      formData.append("name", name);
      formData.append("title", title);
      formData.append("property", JSON.stringify(property));
      formData.append("description", description);

      // Eski rasmlarni massiv ko‘rinishda yuboramiz
      formData.append(
        "oldImages",
        JSON.stringify(Array.isArray(uploaded) ? uploaded : [])
      );

      const res = await axios.put(
        `${window.location.origin}/upload-multi-catalog-edit`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const images = res.data.data.images || [];
      setUploaded(images);

      safeOnChange("images", images);
      safeOnChange("name", name);
      safeOnChange("title", title);
      safeOnChange("property", property);
      safeOnChange("description", description);

      alert("Catalog muvaffaqiyatli yangilandi!");
      window.location.href = "/admin/resources/catalog";
    } catch (err) {
      console.error(err);
      alert("Xatolik: " + err.message);
    }
  };

  return (
    <Box flex flexDirection="column" alignItems="center" mt="xl" width="100%">
      {/* Name */}
      <Box mb="md" width="70%">
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            safeOnChange("name", e.target.value);
          }}
        />
      </Box>

      {/* Title */}
      <Box mb="md" width="70%">
        <Label>Title</Label>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            safeOnChange("title", e.target.value);
          }}
        />
      </Box>

      {/* Property */}
      <Box
        mb="md"
        width="70%"
        style={{
          backgroundColor: "#000",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <Label style={{ color: "white" }}>Property (JSON)</Label>
        <ReactJson
          src={property}
          name={false}
          displayDataTypes={false}
          collapsed={false}
          theme="monokai"
          onEdit={(edit) => {
            const updated = convertValuesToString(edit.updated_src);
            setProperty(updated);
            safeOnChange("property", updated);
          }}
          onAdd={(add) => {
            const updated = convertValuesToString(add.updated_src);
            setProperty(updated);
            safeOnChange("property", updated);
          }}
          onDelete={(del) => {
            const updated = convertValuesToString(del.updated_src);
            setProperty(updated);
            safeOnChange("property", updated);
          }}
        />
      </Box>

      {/* Description */}
      <Box mb="md" width="70%">
        <Label>Description</Label>
        <TextArea
          rows={6}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            safeOnChange("description", e.target.value);
          }}
        />
      </Box>

      {/* Old Images */}
      {uploaded.length > 0 && (
        <Box mb="lg" width="70%">
          <Label>Oldingi rasmlar</Label>
          <Box style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {uploaded.map((img, idx) => (
              <Box key={idx} style={{ position: "relative" }}>
                <img
                  src={img}
                  alt="old"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <Button
                  size="sm"
                  variant="danger"
                  style={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => handleRemoveUploaded(idx)}
                >
                  ❌
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* New Images */}
      <Label>Yangi rasmlar qo'shish</Label>
      {inputs.map((input, index) => (
        <Box key={input.id} mb="md" style={{ display: "flex", gap: "15px" }}>
          <label
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            📂 Fayl tanlash
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(index, e.target.files[0])}
              style={{ display: "none" }}
            />
          </label>
          {input.file && (
            <img
              src={URL.createObjectURL(input.file)}
              alt="preview"
              style={{ width: "70px", height: "70px", objectFit: "cover" }}
            />
          )}
        </Box>
      ))}

      <Button type="button" mt="lg" onClick={addInput} variant="secondary">
        ➕ Yangi rasm qo'shish
      </Button>

      <Button type="button" mt="lg" variant="primary" onClick={handleUpdate}>
        💾 Yangilash
      </Button>
    </Box>
  );
};

export default CatalogEditComponent;
