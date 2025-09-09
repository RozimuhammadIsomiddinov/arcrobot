import React, { useState, useEffect } from "react";
import { Box, Label, Button, Input } from "@adminjs/design-system";
import axios from "axios";

// PrimeReact Editor CSS fayllari endi kerak emas, chunki telefon raqam uchun Input ishlatamiz
const WorkerCreate = () => {
  const [name, setName] = useState("");
  const [workerType, setWorkerType] = useState("");
  const [description, setDescription] = useState(""); // Telefon raqam uchun
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(null);

  const handleUpload = async () => {
    if (!name || !workerType || !description) {
      return alert("Заполните все обязательные поля!");
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("worker_type", workerType);
      formData.append("description", description); // Backendda description nomi bilan saqlanadi
      if (file) formData.append("image", file);

      const res = await axios.post(
        `${window.location.origin}/api/worker`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploaded(res.data.image || null);
      alert("Сотрудник успешно создан!");
      window.location.href = "/admin/resources/worker";
    } catch (err) {
      console.error(err);
      alert("Ошибка: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Box flex flexDirection="column" alignItems="center" mt="xl" width="100%">
      {/* Name */}
      <Box mb="md" width="50%">
        <Label>Имя сотрудника</Label>
        <Input
          value={name}
          width="100%"
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите имя сотрудника"
        />
      </Box>

      {/* Worker type */}
      <Box mb="md" width="50%">
        <Label>Тип сотрудника</Label>
        <Input
          value={workerType}
          width="100%"
          onChange={(e) => setWorkerType(e.target.value)}
          placeholder="Введите тип сотрудника (например: дизайнер, инженер)"
        />
      </Box>

      {/* Phone number */}
      <Box mb="md" width="50%">
        <Label>Телефонный номер</Label>
        <Input
          value={description}
          width="100%"
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Введите номер телефона"
        />
      </Box>

      {/* Image upload */}
      <Box mb="md" width="50%">
        <Label>Фотография сотрудника</Label>
        <label
          style={{
            display: "inline-block",
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          📂 Выбрать файл
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />
        </label>

        {file && (
          <Box
            mt="md"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              color: "white",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {file.name}
            </span>
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </Box>
        )}
      </Box>

      {/* Save button */}
      <Button
        type="button"
        mt="lg"
        variant="primary"
        onClick={(e) => {
          e.preventDefault();
          handleUpload();
        }}
        style={{
          backgroundColor: "#0d6efd",
          padding: "12px 24px",
          fontSize: "16px",
          color: "white",
        }}
      >
        🚀 Сохранить
      </Button>

      {/* Uploaded preview */}
      {uploaded && (
        <Box mt="xl" width="50%">
          <Label>Загруженное фото:</Label>
          <img
            src={uploaded}
            alt="uploaded"
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default WorkerCreate;
