import { Box } from "@mui/material";
import React from "react";

const Banner = () => {
  return (
    <Box
      sx={{
        width: "98%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor:'#000',
        mt:1,
        //mb:1,
        borderRadius:'14px'
      }}
    >
      <Box
        component={"img"}
        src="Banner.png"
        alt="Banner"
        sx={{
          width: "80%",
          height: "auto",
          mt: 1,
          mb: 1,
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          objectFit: "cover",
        }}
      />
    </Box>
  );
};

export default Banner;
