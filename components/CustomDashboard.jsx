import React from "react";
import { Box, H1, Text } from "@adminjs/design-system";

const CustomDashboard = () => {
  return (
    <Box
      flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p="xl"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #74ebd5 0%, #9face6 100%)",
        textAlign: "center",
      }}
    >
      <H1
        style={{
          color: "#2c3e50",
          fontWeight: "bold",
          fontSize: "clamp(24px, 5vw, 42px)", // telefon / desktop moslashuvchan
          marginBottom: "20px",
        }}
      >
        👋 Добро пожаловать в панель Arcbot Admin
      </H1>

      <Text
        fontSize="clamp(16px, 3vw, 20px)"
        style={{
          color: "#333",
          maxWidth: "600px",
          lineHeight: "1.6",
        }}
      >
        Здесь вы можете увидеть основные показатели системы и управлять
        контентом в удобном интерфейсе, адаптированном под любое устройство 💻
      </Text>
    </Box>
  );
};

export default CustomDashboard;
