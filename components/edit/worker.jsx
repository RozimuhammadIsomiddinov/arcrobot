import React, { useState, useEffect } from "react";
import { Box, Label, Input, Button } from "@adminjs/design-system";
import axios from "axios";

// PrimeReact CSS ulash funksiyasi kerak emas, olib tashladim

const WorkerEdit = (props) => {
  const recordId = props.record?.id;

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [workerType, setWorkerType] = useState("");
  const [description, setDescription] = useState(""); // telefon raqam sifatida ishlatiladi

  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recordId) {
      setError("ID mavjud emas");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/worker/${recordId}`);
        const data = res.data;

        setName(data.name || "");
        setWorkerType(data.worker_type || "");
        setDescription(data.description || ""); // telefon raqam backendda description sifatida
        setImage(data.image || null);
      } catch (err) {
        setError("Ошибка при получении данных");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recordId]);

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("worker_type", workerType);
      formData.append("description", description); // telefon raqam description sifatida yuboriladi

      if (newImage) {
        formData.append("image", newImage);
      } else if (image) {
        formData.append("image", image);
      }

      await axios.put(`/api/worker/${recordId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Работник успешно обновлен!");
      window.location.href = "/admin/resources/worker";
    } catch (err) {
      alert("Ошибка при сохранении:" + err.message);
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
        <Label>Имя сотрудника</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите имя"
          width="100%"
        />
      </Box>

      {/* Worker Type */}
      <Box mb="md" width="50%">
        <Label>Тип сотрудника</Label>
        <Input
          value={workerType}
          onChange={(e) => setWorkerType(e.target.value)}
          placeholder="Введите тип сотрудника"
          width="100%"
        />
      </Box>

      {/* Phone Number (description sifatida) */}
      <Box mb="md" width="50%">
        <Label>Телефонный номер</Label>
        <Input
          type="tel"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="+998 90 123 45 67"
          width="100%"
        />
      </Box>

      {/* Image */}
      <Box
        mb="md"
        width="50%"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Label>Фотография</Label>

        {/* Eski rasm */}
        {image && !newImage && (
          <Box mb="md" style={{ textAlign: "center" }}>
            <img
              src={image}
              alt="worker"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px",
                border: "2px solid #007BFF",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
          </Box>
        )}

        {/* Yangi rasm */}
        {newImage && (
          <Box mb="md" style={{ textAlign: "center" }}>
            <img
              src={URL.createObjectURL(newImage)}
              alt="new-worker"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px",
                border: "2px solid #28a745",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
          </Box>
        )}

        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files.length) {
              setNewImage(e.target.files[0]);
            }
          }}
        />
      </Box>

      <Button variant="primary" mt="lg" onClick={handleSave}>
        Сохранить
      </Button>
    </Box>
  );
};

export default WorkerEdit;
