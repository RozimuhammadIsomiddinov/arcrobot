import React, { useState, useEffect } from "react";
import { Box, Label, Input, Button } from "@adminjs/design-system";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const BlogEditImages = (props) => {
  const recordId = props.record?.id;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [subtitles, setSubtitles] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);
  const [updatedImages, setUpdatedImages] = useState({});
  const [newImages, setNewImages] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recordId) {
      setError("ID mavjud emas");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`/blog/${recordId}`);
        const data = res.data;
        setTitle(data.title || "");
        setSubtitles(data.subtitles || "");
        setDescription(data.description || "");
        setImages(Array.isArray(data.images) ? data.images : []);
      } catch (err) {
        setError("Ma'lumotlarni olishda xatolik");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recordId]);

  const handleUpdateImageChange = (index, file) => {
    setUpdatedImages((prev) => ({
      ...prev,
      [index]: file,
    }));
  };

  const handleAddNewImages = (files) => {
    const filesArr = Array.from(files);
    setNewImages((prev) => [...prev, ...filesArr]);
  };

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setUpdatedImages((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("subtitles", subtitles);
      formData.append("description", description);

      // O'chirilmagan eski rasm URL-larini JSON sifatida yuboramiz
      formData.append("images", JSON.stringify(images));

      // updatedImages fayllarini indeks bilan yuboramiz
      Object.entries(updatedImages).forEach(([index, file]) => {
        formData.append(`updatedImages`, file);
      });

      // yangi yuklangan rasmlar
      newImages.forEach((file) => {
        formData.append("newImages", file);
      });

      await axios.put(`/blog/update/${recordId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Ma'lumotlar saqlandi");
      window.location.href = "/admin/resources/blog";
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
      {/* Title */}
      <Box mb="md" width="50%">
        <Label>Заголовок</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите заголовок"
          width="100%"
        />
      </Box>

      {/* Subtitles */}
      <Box mb="md" width="50%">
        <Label>Подзаголовок</Label>
        <Input
          value={subtitles}
          onChange={(e) => setSubtitles(e.target.value)}
          placeholder="Введите подзаголовок"
          width="100%"
        />
      </Box>

      {/* Description with CKEditor */}
      <Box mb="md" width="50%">
        <Label>Описание</Label>
        <CKEditor
          editor={ClassicEditor}
          data={description}
          config={{
            heading: {
              options: [
                {
                  model: "paragraph",
                  title: "Абзац",
                  class: "ck-heading_paragraph",
                },
              ],
            },
          }}
          onReady={(editor) => {
            editor.editing.view.change((writer) => {
              writer.setStyle(
                "color",
                "black",
                editor.editing.view.document.getRoot()
              );
            });
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setDescription(data);
          }}
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

      <Button variant="primary" mt="lg" onClick={handleSave}>
        Сохранить
      </Button>
    </Box>
  );
};

export default BlogEditImages;
