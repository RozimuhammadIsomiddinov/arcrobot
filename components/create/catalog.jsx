import React, { useState, useEffect } from "react";
import { Box, Label, Button, Input } from "@adminjs/design-system";
import axios from "axios";
import { Editor } from "primereact/editor";

// PrimeReact CSS fayllarini dinamik ravishda qo'shish
const addPrimeStyles = () => {
  const themeUrl =
    "https://cdn.jsdelivr.net/npm/primereact@9.6.0/resources/themes/lara-light-blue/theme.css";
  const coreUrl =
    "https://cdn.jsdelivr.net/npm/primereact@9.6.0/resources/primereact.min.css";
  const iconsUrl =
    "https://cdn.jsdelivr.net/npm/primeicons@6.0.1/primeicons.css";

  const existingLinks = Array.from(document.head.querySelectorAll("link")).map(
    (link) => link.href
  );

  if (!existingLinks.includes(themeUrl)) {
    const themeLink = document.createElement("link");
    themeLink.rel = "stylesheet";
    themeLink.href = themeUrl;
    document.head.appendChild(themeLink);
  }

  if (!existingLinks.includes(coreUrl)) {
    const coreLink = document.createElement("link");
    coreLink.rel = "stylesheet";
    coreLink.href = coreUrl;
    document.head.appendChild(coreLink);
  }

  if (!existingLinks.includes(iconsUrl)) {
    const iconsLink = document.createElement("link");
    iconsLink.rel = "stylesheet";
    iconsLink.href = iconsUrl;
    document.head.appendChild(iconsLink);
  }
};

// ✨ Editor uchun headerTemplate
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

const CatalogCreate = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [properties, setProperties] = useState([{ key: "", value: "" }]);

  // images uchun
  const [inputs, setInputs] = useState([{ id: Date.now(), file: null }]);

  // other_images uchun
  const [otherInputs, setOtherInputs] = useState([
    { id: Date.now() + 1, file: null },
  ]);

  useEffect(() => {
    addPrimeStyles();
  }, []);

  // property o'zgartirish
  const handlePropertyChange = (index, field, value) => {
    const updated = [...properties];
    updated[index][field] = value;
    setProperties(updated);
  };

  const addProperty = () =>
    setProperties([...properties, { key: "", value: "" }]);
  const removeProperty = (index) =>
    setProperties(properties.filter((_, i) => i !== index));

  // rasm tanlash
  const handleFileChange = (index, file) => {
    const newInputs = [...inputs];
    newInputs[index].file = file;
    setInputs(newInputs);
  };

  // other_images rasm tanlash
  const handleOtherFileChange = (index, file) => {
    const newInputs = [...otherInputs];
    newInputs[index].file = file;
    setOtherInputs(newInputs);
  };

  // yangi rasm input qo'shish
  const addInput = () => {
    if (inputs.length >= 10)
      return alert("Максимум можно загрузить 10 изображений!");
    setInputs([...inputs, { id: Date.now(), file: null }]);
  };

  const addOtherInput = () => {
    if (otherInputs.length >= 10)
      return alert("Максимум можно загрузить 10 изображений!");
    setOtherInputs([...otherInputs, { id: Date.now(), file: null }]);
  };

  const handleSave = async () => {
    // Validatsiya
    const imagesCount = inputs.filter((i) => i.file).length;
    const otherImagesCount = otherInputs.filter((i) => i.file).length;
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

      otherInputs.forEach((input) => {
        if (input.file) formData.append("other_files", input.file);
      });

      await axios.post(
        `${window.location.origin}/api/catalog/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

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
        <Input
          value={name}
          width="100%"
          onChange={(e) => setName(e.target.value)}
        />
      </Box>

      {/* Title */}
      <Box mb="md" width="70%">
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

      {/* Other Images */}
      <Label
        mb="lg"
        style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}
      >
        Дополнительные изображения ( MARKER )
      </Label>

      {otherInputs.map((input, index) => (
        <Box key={input.id} mb="md" style={styles.fileBox}>
          <label style={styles.fileLabel}>
            📂 Выбрать файл
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleOtherFileChange(index, e.target.files[0])}
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
                style={styles.preview}
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
        onClick={addOtherInput}
        style={styles.addBtn}
      >
        ➕ Добавить дополнительное изображение
      </Button>

      {/* Images */}
      <Label mb="lg" mt="xl" style={{ fontSize: "20px", fontWeight: "bold" }}>
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
                style={styles.preview}
              />
            </>
          ) : (
            <span style={{ color: "#555" }}>Файл не выбран</span>
          )}
        </Box>
      ))}

      <Button type="button" mt="lg" onClick={addInput} style={styles.addBtn}>
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

const styles = {
  fileBox: {
    backgroundColor: "rgba(165, 231, 214, 0.8)",
    padding: "10px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    width: "70%",
  },
  fileLabel: {
    display: "inline-block",
    backgroundColor: "#007bff",
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  preview: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  addBtn: {
    backgroundColor: "rgba(20, 185, 211, 0.8)",
    color: "white",
  },
};

export default CatalogCreate;
