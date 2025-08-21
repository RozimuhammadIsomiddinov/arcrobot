import React, { useState, useEffect } from "react";
import { Box, Label, Input, Button } from "@adminjs/design-system";
import axios from "axios";
import { Editor } from "primereact/editor";

// PrimeReact CSS dinamik ulash
const addPrimeStyles = () => {
  const themeUrl =
    "https://cdn.jsdelivr.net/npm/primereact@9.6.0/resources/themes/lara-light-blue/theme.css";
  const coreUrl =
    "https://cdn.jsdelivr.net/npm/primereact@9.6.0/resources/primereact.min.css";
  const iconsUrl =
    "https://cdn.jsdelivr.net/npm/primeicons@6.0.1/primeicons.css";

  const existing = Array.from(document.head.querySelectorAll("link")).map(
    (l) => l.href
  );

  if (!existing.includes(themeUrl)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = themeUrl;
    document.head.appendChild(link);
  }
  if (!existing.includes(coreUrl)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = coreUrl;
    document.head.appendChild(link);
  }
  if (!existing.includes(iconsUrl)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = iconsUrl;
    document.head.appendChild(link);
  }
};

// Editor toolbar
const headerTemplate = (
  <span className="ql-formats">
    {/* Matn stilini sozlash */}
    <select className="ql-font">
      <option selected></option>
      <option value="serif"></option>
      <option value="monospace"></option>
    </select>

    <select className="ql-size">
      <option value="small"></option>
      <option selected></option>
      <option value="large"></option>
      <option value="huge"></option>
    </select>

    {/* Bold, Italic, Underline va Strike */}
    <button className="ql-bold" aria-label="Bold"></button>
    <button className="ql-italic" aria-label="Italic"></button>
    <button className="ql-underline" aria-label="Underline"></button>
    <button className="ql-strike" aria-label="Strike"></button>

    {/* Heading */}
    <select className="ql-header">
      <option value="1">H1</option>
      <option value="2">H2</option>
      <option value="3">H3</option>
      <option value="4">H4</option>
      <option value="5">H5</option>
      <option value="6">H6</option>
      <option selected>Normal</option>
    </select>

    {/* Ranglar */}
    <select className="ql-color"></select>
    <select className="ql-background"></select>

    {/* Listlar */}
    <button
      className="ql-list"
      value="ordered"
      aria-label="Ordered List"
    ></button>
    <button
      className="ql-list"
      value="bullet"
      aria-label="Unordered List"
    ></button>
    <button
      className="ql-indent"
      value="-1"
      aria-label="Decrease Indent"
    ></button>
    <button
      className="ql-indent"
      value="+1"
      aria-label="Increase Indent"
    ></button>

    {/* Align */}
    <select className="ql-align"></select>

    {/* Quote va Code */}
    <button className="ql-blockquote" aria-label="Blockquote"></button>
    <button className="ql-code-block" aria-label="Code Block"></button>

    {/* Link, Image, Video */}
    <button className="ql-link" aria-label="Link"></button>
    <button className="ql-image" aria-label="Image"></button>
    <button className="ql-video" aria-label="Video"></button>

    {/* Tozalash */}
    <button className="ql-clean" aria-label="Remove Formatting"></button>
  </span>
);

const CatalogEdit = (props) => {
  const recordId = props.record?.id;

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [updatedImages, setUpdatedImages] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    addPrimeStyles();
  }, []);

  // Ma'lumotlarni olish
  useEffect(() => {
    if (!recordId) {
      setError("ID mavjud emas");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/catalog/${recordId}`);
        const data = res.data;

        setName(data.name || "");
        setTitle(data.title || "");
        setDescription(data.description || "");

        // Images parse
        let parsedImages = [];
        if (typeof data.images === "string") {
          if (data.images.startsWith("{") && data.images.endsWith("}")) {
            parsedImages = data.images
              .slice(1, -1)
              .split(",")
              .map((url) => url.trim().replace(/^"|"$/g, ""));
          } else {
            try {
              parsedImages = JSON.parse(data.images);
            } catch {
              parsedImages = [];
            }
          }
        } else if (Array.isArray(data.images)) {
          parsedImages = data.images;
        }
        setImages(parsedImages);

        // Properties parse
        let parsedProps = [];
        if (typeof data.property === "string") {
          try {
            const obj = JSON.parse(data.property);
            parsedProps = Object.entries(obj).map(([key, value]) => ({
              key,
              value,
            }));
          } catch {
            parsedProps = [];
          }
        } else if (
          typeof data.property === "object" &&
          data.property !== null
        ) {
          parsedProps = Object.entries(data.property).map(([key, value]) => ({
            key,
            value,
          }));
        }
        setProperties(parsedProps);
      } catch (err) {
        setError("Ошибка при получении данных");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recordId]);

  // Property qo‘shish
  const handleAddProperty = () => {
    setProperties([...properties, { key: "", value: "" }]);
  };

  // Property o‘zgartirish
  const handlePropertyChange = (index, field, value) => {
    const updated = [...properties];
    updated[index][field] = value;
    setProperties(updated);
  };

  // Property o‘chirish
  const handleRemoveProperty = (index) => {
    const updated = [...properties];
    updated.splice(index, 1);
    setProperties(updated);
  };

  // Rasm yangilash
  const handleUpdateImageChange = (index, file) => {
    setUpdatedImages((prev) => ({
      ...prev,
      [index]: file,
    }));
  };

  // Yangi rasm qo‘shish
  const handleAddNewImages = (files) => {
    const filesArr = Array.from(files);
    setNewImages((prev) => [...prev, ...filesArr]);
  };

  // Rasm o‘chirish
  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setUpdatedImages((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  // Saqlash
  const handleSave = async () => {
    if (images.length === 0 && newImages.length === 0) {
      alert("Пожалуйста, загрузите хотя бы одно изображение");
      return;
    }
    if (properties.length === 0) {
      alert("Добавьте хотя бы одно свойство");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("title", title);
      formData.append("description", description);
      formData.append(
        "property",
        JSON.stringify(
          Object.fromEntries(properties.map((p) => [p.key, p.value]))
        )
      );
      formData.append("images", JSON.stringify(images));

      //  updatedImages — backendga updatedImages[index] formatida yuboriladi
      Object.entries(updatedImages).forEach(([index, file]) => {
        formData.append("updatedImages", file); // bir nechta file bo‘lishi mumkin
      });

      //  newImages — backendga newImages sifatida yuboriladi
      newImages.forEach((file) => {
        formData.append("newImages", file);
      });

      await axios.put(`/api/catalog/update/${recordId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Данные сохранены");
      window.location.href = "/admin/resources/catalog";
    } catch (err) {
      alert("Saqlashda xatolik: " + err.message);
      console.error(err);
    }
  };

  if (loading) return <Box padding="xl">Загрузка...</Box>;
  if (error)
    return (
      <Box padding="xl" color="red">
        {error}
      </Box>
    );

  return (
    <Box>
      {/* Name */}
      <Box mb="md" width="50%">
        <Label>Имя</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите имя"
          width="100%"
        />
      </Box>

      {/* Title */}
      <Box mb="md" width="50%">
        <Label>Заголовок</Label>
        <textarea
          value={title}
          style={{
            width: "100%",
            padding: "1rem",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            fontSize: "14px",
            fontFamily: "inherit",
            minHeight: "100px",
            backgroundColor: "black",
            color: "white",
          }}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите заголовок"
          width="100%"
        />
      </Box>

      {/* Description */}
      <Box
        mb="md"
        width="70%"
        style={{
          backgroundColor: "rgba(104, 144, 156, 0.1)",
          padding: "10px",
          borderRadius: "8px",
          color: "white",
        }}
      >
        <Label>Описание</Label>
        <Editor
          value={description}
          onTextChange={(e) => setDescription(e.htmlValue)}
          headerTemplate={headerTemplate}
          style={{ height: "300px" }}
        />
      </Box>

      {/* Images */}
      <Box mb="md" width="60%">
        <Label>Изображения</Label>
        <Box display="flex" flexWrap="wrap" gap="20px">
          {images.length === 0 && <div>Изображений нет</div>}
          {images.map((img, idx) => (
            <Box
              key={idx}
              style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "10px",
                position: "relative",
                width: 140,
                textAlign: "center",
              }}
            >
              <img
                src={
                  updatedImages[idx]
                    ? URL.createObjectURL(updatedImages[idx])
                    : img
                }
                alt={`img-${idx}`}
                style={{
                  width: "120px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
              <button
                onClick={() => handleDeleteImage(idx)}
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  cursor: "pointer",
                }}
                title="Удалить изображение"
              >
                ×
              </button>
              <input
                type="file"
                accept="image/*"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  opacity: 0,
                  width: "120px",
                  height: "30px",
                  cursor: "pointer",
                }}
                onChange={(e) => {
                  if (e.target.files.length) {
                    handleUpdateImageChange(idx, e.target.files[0]);
                  }
                }}
              />
              <label
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#007bff",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                Обновить
              </label>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Add new images */}
      <Box mb="md" width="50%">
        <Label>Добавить новые изображения</Label>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleAddNewImages(e.target.files)}
        />
        {newImages.length > 0 && (
          <Box mt="md" display="flex" flexWrap="wrap" gap="10px">
            {newImages.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`new-img-${idx}`}
                style={{
                  width: 80,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Properties */}
      <Box mb="md" width="60%">
        <Label>Свойства</Label>
        {properties.map((prop, idx) => (
          <Box key={idx} display="flex" alignItems="center" mb="sm" gap="10px">
            <Input
              placeholder="Ключ"
              value={prop.key}
              onChange={(e) => handlePropertyChange(idx, "key", e.target.value)}
            />
            <Input
              placeholder="Значение"
              value={prop.value}
              onChange={(e) =>
                handlePropertyChange(idx, "value", e.target.value)
              }
            />
            <Button
              variant="danger"
              onClick={() => handleRemoveProperty(idx)}
              size="sm"
            >
              ×
            </Button>
          </Box>
        ))}
        <Button variant="primary" onClick={handleAddProperty}>
          Добавить свойство
        </Button>
      </Box>

      <Button variant="primary" mt="lg" onClick={handleSave}>
        Сохранить
      </Button>
    </Box>
  );
};

export default CatalogEdit;
