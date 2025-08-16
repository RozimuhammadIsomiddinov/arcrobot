import React, { useState } from "react";
import { Box, Button, Input, Label } from "@adminjs/design-system";
import axios from "axios";

const SiteEditComponent = ({ record }) => {
  const [formData, setFormData] = React.useState({
    name: record?.params?.name || "",
    link: record?.params?.link || "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/api/sites/update/${record.params.id}`, formData);
      alert("Сохранено успешно!");
      window.location.href = "/admin/resources/sites";
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Label>Название</Label>
      <Input
        width="100%"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        required
      />

      <Label marginTop="lg">Ссылка</Label>
      <Input
        width="100%"
        value={formData.link}
        onChange={(e) => handleChange("link", e.target.value)}
        required
      />

      <Button type="submit" variant="primary" marginTop="xl" width="100%">
        Сохранить
      </Button>
    </form>
  );
};

export default SiteEditComponent;
