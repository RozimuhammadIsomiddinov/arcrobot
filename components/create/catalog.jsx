import React, { useState, useEffect, useRef } from "react";
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

    <button className="ql-clean" aria-label="Remove Formatting"></button>
  </span>
);

const CatalogCreate = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [properties, setProperties] = useState([{ key: "", value: "" }]);
  const [orderKey, setOrderKey] = useState("");

  // asosiy images inputs - har biri {id, file}
  const [inputs, setInputs] = useState([{ id: Date.now(), file: null }]);
  const [previews, setPreviews] = useState({}); // { id: objectURL }

  // other_images inputs
  const [otherInputs, setOtherInputs] = useState([
    { id: Date.now() + 1, file: null },
  ]);
  const [otherPreviews, setOtherPreviews] = useState({});

  // sotuv maydonlari
  const [price, setPrice] = useState("");
  const [isDiscount, setIsDiscount] = useState(false);
  const [deliveryDays, setDeliveryDays] = useState("");
  const [storageDays, setStorageDays] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const isMountedRef = useRef(true);

  useEffect(() => {
    addPrimeStyles();
    return () => {
      // Unmountda objectURLlarni tozalash
      Object.values(previews).forEach((u) => u && URL.revokeObjectURL(u));
      Object.values(otherPreviews).forEach((u) => u && URL.revokeObjectURL(u));
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // propertylar bilan ishlash
  const handlePropertyChange = (index, field, value) => {
    const updated = [...properties];
    updated[index][field] = value;
    setProperties(updated);
  };
  const addProperty = () =>
    setProperties([...properties, { key: "", value: "" }]);
  const removeProperty = (index) =>
    setProperties(properties.filter((_, i) => i !== index));

  // file change handlers (main images)
  const handleFileChange = (index, file) => {
    const newInputs = [...inputs];
    const id = newInputs[index].id;
    // revoke old preview if existed
    if (previews[id]) {
      URL.revokeObjectURL(previews[id]);
    }

    newInputs[index].file = file;
    setInputs(newInputs);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews((p) => ({ ...p, [id]: url }));
    } else {
      setPreviews((p) => {
        const copy = { ...p };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleOtherFileChange = (index, file) => {
    const newInputs = [...otherInputs];
    const id = newInputs[index].id;
    if (otherPreviews[id]) {
      URL.revokeObjectURL(otherPreviews[id]);
    }

    newInputs[index].file = file;
    setOtherInputs(newInputs);

    if (file) {
      const url = URL.createObjectURL(file);
      setOtherPreviews((p) => ({ ...p, [id]: url }));
    } else {
      setOtherPreviews((p) => {
        const copy = { ...p };
        delete copy[id];
        return copy;
      });
    }
  };

  // add/remove image inputs
  const addInput = () => {
    if (inputs.length >= 10) {
      alert("Максимум можно загрузить 10 изображений!");
      return;
    }
    setInputs([...inputs, { id: Date.now(), file: null }]);
  };
  const removeInput = (index) => {
    const removed = inputs[index];
    if (removed && previews[removed.id]) {
      URL.revokeObjectURL(previews[removed.id]);
      setPreviews((p) => {
        const copy = { ...p };
        delete copy[removed.id];
        return copy;
      });
    }
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const addOtherInput = () => {
    if (otherInputs.length >= 10) {
      alert("Максимум можно загрузить 10 изображений!");
      return;
    }
    setOtherInputs([...otherInputs, { id: Date.now(), file: null }]);
  };
  const removeOtherInput = (index) => {
    const removed = otherInputs[index];
    if (removed && otherPreviews[removed.id]) {
      URL.revokeObjectURL(otherPreviews[removed.id]);
      setOtherPreviews((p) => {
        const copy = { ...p };
        delete copy[removed.id];
        return copy;
      });
    }
    setOtherInputs(otherInputs.filter((_, i) => i !== index));
  };

  // validation va submit
  const handleSave = async () => {
    // Basic validation
    const imagesCount = inputs.filter((i) => i.file).length;
    const otherImagesCount = otherInputs.filter((i) => i.file).length;
    const validPropertiesCount = properties.filter(
      (p) => p.key && p.key.trim().length > 0
    ).length;

    if (imagesCount === 0 && otherImagesCount === 0) {
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
      setLoading(true);
      setProgress(0);

      // property obyekt
      const propertyObj = {};
      properties.forEach((p) => {
        if (p.key && p.key.trim()) propertyObj[p.key.trim()] = p.value || "";
      });

      const formData = new FormData();
      formData.append("name", name);
      formData.append("title", title);
      formData.append("subtitle", subtitle);

      formData.append("description", description || "");
      formData.append("property", JSON.stringify(propertyObj));
      if (orderKey) formData.append("order_key", orderKey);

      // files
      inputs.forEach((input) => {
        if (input.file) formData.append("files", input.file);
      });
      otherInputs.forEach((input) => {
        if (input.file) formData.append("other_files", input.file);
      });

      // sotuv maydonlari: stringlarga convert
      const parsedPrice = price === "" ? "0" : String(parseFloat(price) || 0);
      formData.append("price", parsedPrice);
      formData.append("isDiscount", isDiscount ? "true" : "false");
      formData.append(
        "delivery_days",
        deliveryDays === "" ? "" : String(parseInt(deliveryDays, 10))
      );
      formData.append(
        "storage_days",
        storageDays === "" ? "" : String(parseInt(storageDays, 10))
      );

      const resp = await axios.post(
        `${window.location.origin}/api/catalog/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (!isMountedRef.current) return;
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setProgress(percent);
          },
        }
      );

      if (resp?.data?.success) {
        alert("Каталог успешно создан!");
        window.location.href = "/admin/resources/catalog";
      } else {
        alert(
          "Ошибка при создании: " +
            (resp?.data?.error || JSON.stringify(resp?.data))
        );
      }
    } catch (err) {
      console.error(err);
      alert(
        "Ошибка: " +
          (err?.response?.data?.error ||
            err.message ||
            "Во время сохранения произошла ошибка")
      );
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setProgress(0);
      }
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
      </Box>{" "}
      <Box mb="md" width="70%">
        <Label>Порядковый номер </Label>
        <Input
          type="number"
          min="1"
          value={orderKey}
          width="100%"
          onChange={(e) => setOrderKey(e.target.value)}
          placeholder="Введите номер"
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
      {/* Subtitle */}
      <Box mb="md" width="70%">
        <Label>Подзаголовок</Label>
        <textarea
          value={subtitle}
          style={{
            width: "100%",
            padding: "1rem",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            fontSize: "14px",
            fontFamily: "inherit",
            minHeight: "80px",
            backgroundColor: "black",
            color: "white",
          }}
          onChange={(e) => setSubtitle(e.target.value)}
        />
      </Box>{" "}
      {/* Price & meta */}
      <Box mb="md" width="70%" display="flex" gap="12px" alignItems="center">
        <Box width="30%">
          <Label>Цена</Label>
          <Input
            value={price}
            type="number"
            step="0.01"
            min="0"
            onChange={(e) => setPrice(e.target.value)}
          />
        </Box>

        <Box width="20%">
          <Label>наличными</Label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              id="isDiscount"
              type="checkbox"
              checked={isDiscount}
              onChange={(e) => setIsDiscount(e.target.checked)}
            />
            <label htmlFor="isDiscount">Есть</label>
          </div>
        </Box>

        <Box width="25%">
          <Label>Доставка (дней)</Label>
          <Input
            value={deliveryDays}
            type="number"
            min="0"
            onChange={(e) => setDeliveryDays(e.target.value)}
          />
        </Box>

        <Box width="25%">
          <Label>Срок хранения (дней)</Label>
          <Input
            value={storageDays}
            type="number"
            min="0"
            onChange={(e) => setStorageDays(e.target.value)}
          />
        </Box>
      </Box>
      {/* Description */}
      <Box
        mb="md"
        width="70%"
        style={{
          backgroundColor: "rgba(104, 144, 156, 0.06)",
          padding: "10px",
          borderRadius: "8px",
          color: "white",
        }}
      >
        <Label>Описание</Label>
        <Editor
          value={description}
          onTextChange={(e) => setDescription(e.htmlValue || e.html || "")}
          headerTemplate={headerTemplate}
          style={{ height: "300px" }}
        />
      </Box>
      {/* Properties */}
      <Box mb="md" width="70%">
        <Label>Свойства</Label>
        {properties.map((p, index) => (
          <Box
            key={p.key + index}
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
              {previews[input.id] && (
                <img
                  src={previews[input.id]}
                  alt="preview"
                  style={styles.preview}
                />
              )}
              <Button
                type="button"
                size="icon"
                variant="danger"
                onClick={() => removeInput(index)}
              >
                🗑
              </Button>
            </>
          ) : (
            <>
              <span style={{ color: "#555" }}>Файл не выбран</span>
              <Button
                type="button"
                size="icon"
                variant="danger"
                onClick={() => removeInput(index)}
                style={{ marginLeft: "auto" }}
              >
                ❌
              </Button>
            </>
          )}
        </Box>
      ))}
      <Button type="button" mt="lg" onClick={addInput} style={styles.addBtn}>
        ➕ Добавить изображение
      </Button>
      {/* Other Images */}
      <Label
        mb="lg"
        mt="xl"
        style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}
      >
        Дополнительные изображения
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
              {otherPreviews[input.id] && (
                <img
                  src={otherPreviews[input.id]}
                  alt="preview"
                  style={styles.preview}
                />
              )}
              <Button
                type="button"
                size="icon"
                variant="danger"
                onClick={() => removeOtherInput(index)}
              >
                🗑
              </Button>
            </>
          ) : (
            <>
              <span style={{ color: "#555" }}>Файл не выбран</span>
              <Button
                type="button"
                size="icon"
                variant="danger"
                onClick={() => removeOtherInput(index)}
              >
                ❌
              </Button>
            </>
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
      {/* Progress & Save */}
      {loading && (
        <Box width="70%" mt="md">
          <Label>Загрузка: {progress}%</Label>
          <progress value={progress} max="100" style={{ width: "100%" }} />
        </Box>
      )}
      <Button
        type="button"
        mt="lg"
        variant="primary"
        onClick={(e) => {
          e.preventDefault();
          if (!loading) handleSave();
        }}
        style={{ marginTop: 12 }}
        disabled={loading}
      >
        {loading ? "Идет загрузка..." : "🚀 Сохранить"}
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
