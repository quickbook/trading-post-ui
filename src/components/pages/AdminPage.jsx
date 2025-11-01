import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import AddFirmForm from "../sections/AddFirmForm";
import ViewAllFirms from "../sections/ViewAllFirms";
import { cardData } from "../../../CardsData";

const drawerWidth = '320px';

const AdminPage = () => {
  const [activeView, setActiveView] = useState("add");
  const [firms, setFirms] = useState([]);
  const [editingFirm, setEditingFirm] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Load firms from localStorage on component mount
  useEffect(() => {
    const savedFirms = localStorage.getItem("tradingFirms");
    if (savedFirms) {
      setFirms(JSON.parse(savedFirms));
    }
  }, []);

  // Save firms to localStorage whenever firms change
  useEffect(() => {
    localStorage.setItem("tradingFirms", JSON.stringify(firms));
  }, [firms]);

  const handleAddFirm = (firmData) => {
    if (editingFirm) {
      // Update existing firm
      const updatedFirms = firms.map((firm) =>
        firm.id === editingFirm.id
          ? { ...firmData, id: editingFirm.id, updated: true }
          : firm
      );
      setFirms(updatedFirms);
      setEditingFirm(null);
    } else {
      // Add new firm
      const newFirm = {
        ...firmData,
        id: Date.now(), // Simple ID generation
        updated: false,
      };
      setFirms([...firms, newFirm]);
    }
    setActiveView("view");
  };

  const handleEditFirm = (firm) => {
    setEditingFirm(firm);
    setActiveView("add");
  };

  const handleDeleteFirm = (firmId) => {
    if (window.confirm("Are you sure you want to delete this firm?")) {
      setFirms(firms.filter((firm) => firm.id !== firmId));
    }
  };

  const handleCancelEdit = () => {
    setEditingFirm(null);
    setActiveView("view");
  };

  const menuItems = [
    {
      text: "Add New Firm",
      icon: <AddIcon />,
      view: "add",
    },
    {
      text: "View All Firms",
      icon: <ViewListIcon />,
      view: "view",
    },
  ];

  const drawer = (
    <Box>
      <Typography
        variant="h6"
        sx={{
          p: 2,
          mt: '90px',
          textAlign: "center",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          backgroundColor: "#ffffff30",
          color: "white",
        }}
      >
        Admin Dashboard
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={activeView === item.view}
              onClick={() => {
                setActiveView(item.view);
                setEditingFirm(null);
              }}
              sx={{
                color: activeView === item.view ? "white" : "#808080",
                "&.Mui-selected": {
                  backgroundColor: "#4b0082",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#4b0082a1",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeView === item.view ? "white" : "#808080",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={false}
            onClose={() => {}}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                backgroundColor: "#00000010",
                boxSizing: "border-box",
                width: drawerWidth,
                //zIndex: -1000,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        {activeView === "add" ? (
          <AddFirmForm
            firm={editingFirm}
            onSubmit={handleAddFirm}
            onCancel={editingFirm ? handleCancelEdit : null}
          />
        ) : (
          <ViewAllFirms
            firms={cardData}
            onEdit={handleEditFirm}
            onDelete={handleDeleteFirm}
          />
        )}
      </Box>
    </Box>
  );
};

export default AdminPage;
