import React, { useEffect, useState } from "react";
import { Box, Button, Label, Input, TextArea } from "@adminjs/design-system";

const SubtitlesEdit = (props) => {
  const { property, record, onChange } = props;

  const [subtitles, setSubtitles] = useState(() => {
    try {
      return record.params[property.path] || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    onChange(property.path, subtitles);
  }, [subtitles]);

  const handleChange = (index, field, value) => {
    const updated = [...subtitles];
    updated[index][field] = value;
    setSubtitles(updated);
  };

  const addSubtitle = () => {
    setSubtitles([...subtitles, { subtitle: "", description: "" }]);
  };

  const removeSubtitle = (index) => {
    const updated = subtitles.filter((_, i) => i !== index);
    setSubtitles(updated);
  };

  return (
    <Box>
      <Label>Subtitles</Label>
      {subtitles.map((item, index) => (
        <Box key={index} mb="xl" borderBottom="1px solid #ccc" pb="lg">
          <Label>Subtitle {index + 1}</Label>
          <Input
            value={item.subtitle}
            onChange={(e) => handleChange(index, "subtitle", e.target.value)}
            placeholder="Subtitle"
          />
          <Label mt="lg">Description</Label>
          <TextArea
            value={item.description}
            onChange={(e) => handleChange(index, "description", e.target.value)}
            placeholder="Description"
            rows={3}
          />
          <Button
            mt="md"
            size="sm"
            variant="danger"
            onClick={() => removeSubtitle(index)}
          >
            O'chirish
          </Button>
        </Box>
      ))}

      <Button mt="lg" onClick={addSubtitle}>
        + Yangi Subtitle qo‘shish
      </Button>
    </Box>
  );
};

export default SubtitlesEdit;
