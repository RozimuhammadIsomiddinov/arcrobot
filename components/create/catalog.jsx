import React, { useState } from "react";
import { Box, Label, Button, Input, TextArea } from "@adminjs/design-system";
import axios from "axios";

const CatalogCreate = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [properties, setProperties] = useState([{ key: "", value: "" }]);
  const [inputs, setInputs] = useState([{ id: Date.now(), file: null }]);

  // property o'zgartirish
  const handlePropertyChange = (index, field, value) => {
    const updated = [...properties];
    updated[index][field] = value;
    setProperties(updated);
  };

  const addProperty = () => {
    setProperties([...properties, { key: "", value: "" }]);
  };

  const removeProperty = (index) => {
    setProperties(properties.filter((_, i) => i !== index));
  };

  // rasm tanlash
  const handleFileChange = (index, file) => {
    const newInputs = [...inputs];
    newInputs[index].file = file;
    setInputs(newInputs);
  };

  // yangi rasm input qo'shish
  const addInput = () => {
    if (inputs.length >= 10) {
      return alert("Максимум можно загрузить 10 изображений!");
    }
    setInputs([...inputs, { id: Date.now(), file: null }]);
  };

  const handleSave = async () => {
    // Validatsiya:
    const imagesCount = inputs.filter((i) => i.file).length;
    const validPropertiesCount = properties.filter(
      (p) => p.key && p.key.trim().length > 0
    ).length;

    if (imagesCount === 0 && validPropertiesCount === 0) {
      alert(
        "Ошибка: Пожалуйста, загрузите хотя бы одно изображение и добавьте хотя бы одно свойство."
      );
      return;
    }

    if (imagesCount === 0) {
      alert("Ошибка: Пожалуйста, загрузите хотя бы одно изображение.");
      return;
    }

    if (validPropertiesCount === 0) {
      alert(
        "Ошибка: Пожалуйста, добавьте хотя бы одно свойство (введите ключ)."
      );
      return;
    }

    // Hammasi ok — yuborish
    try {
      const propertyObj = {};
      properties.forEach((p) => {
        if (p.key && p.key.trim()) propertyObj[p.key.trim()] = p.value;
      });

      const formData = new FormData();
      formData.append("name", name);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("property", JSON.stringify(propertyObj));

      inputs.forEach((input) => {
        if (input.file) formData.append("files", input.file);
      });

      await axios.post(`${window.location.origin}/catalog/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Каталог успешно создан!");
      window.location.href = "/admin/resources/catalog";
    } catch (err) {
      console.error(err);
      alert(
        "Ошибка: " + (err.message || "Во время сохранения произошла ошибка")
      );
    }
  };

  return (
    <Box flex flexDirection="column" alignItems="center" mt="xl" width="100%">
      {/* Name */}
      <Box mb="md" width="70%">
        <Label>Название</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Box>

      {/* Title */}
      <Box mb="md" width="70%">
        <Label>Заголовок</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Box>

      {/* Description */}
      <Box mb="md" width="70%">
        <Label>Описание</Label>
        <TextArea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Box>

      {/* Properties */}
      <Box mb="md" width="70%">
        <Label>Свойства</Label>
        {properties.map((p, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="10px"
            mb="sm"
          >
            <Input
              placeholder="Ключ"
              value={p.key}
              onChange={(e) =>
                handlePropertyChange(index, "key", e.target.value)
              }
              style={{ flex: 1 }}
            />
            <Input
              placeholder="Значение"
              value={p.value}
              onChange={(e) =>
                handlePropertyChange(index, "value", e.target.value)
              }
              style={{ flex: 1 }}
            />
            <Button
              type="button"
              size="icon"
              variant="danger"
              onClick={() => removeProperty(index)}
            >
              ❌
            </Button>
          </Box>
        ))}
        <Button
          type="button"
          variant="primary"
          onClick={addProperty}
          style={{ marginTop: "5px" }}
        >
          ➕ Добавить свойство
        </Button>
      </Box>

      {/* Images */}
      <Label mb="lg" style={{ fontSize: "20px", fontWeight: "bold" }}>
        Изображения (максимум 10)
      </Label>

      {inputs.map((input, index) => (
        <Box
          key={input.id}
          mb="md"
          style={{
            backgroundColor: "rgba(165, 231, 214, 0.8)",
            padding: "10px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            width: "70%",
          }}
        >
          <label
            style={{
              display: "inline-block",
              backgroundColor: "#007bff",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            📂 Выбрать файл
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(index, e.target.files[0])}
              style={{ display: "none" }}
            />
          </label>

          {input.file ? (
            <>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>
                {input.file.name}
              </span>
              <img
                src={URL.createObjectURL(input.file)}
                alt="preview"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </>
          ) : (
            <span style={{ color: "#555" }}>Файл не выбран</span>
          )}
        </Box>
      ))}

      <Button
        type="button"
        mt="lg"
        onClick={addInput}
        style={{ backgroundColor: "rgba(20, 185, 211, 0.8)", color: "white" }}
      >
        ➕ Добавить изображение
      </Button>

      <Button
        type="button"
        mt="lg"
        variant="primary"
        onClick={(e) => {
          e.preventDefault();
          handleSave();
        }}
        style={{ marginTop: 12 }}
      >
        🚀 Сохранить
      </Button>
    </Box>
  );
};

export default CatalogCreate;
