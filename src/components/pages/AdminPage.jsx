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
import ChallengeIcon from "@mui/icons-material/EmojiEvents";
import AddFirmForm from "../sections/AddFirmForm";
import ViewAllFirms from "../sections/ViewAllFirms";
import { cardData } from "../../../CardsData";
import FirmChallengesEdit from "../sections/FirmChallengesEdit";

const drawerWidth = "320px";

const AdminPage = () => {
  const [activeView, setActiveView] = useState("add");
  const [firms, setFirms] = useState(cardData);
  const [editingFirm, setEditingFirm] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

  const handleUpdateChallenge = (challengeId, challengeData) => {
    const { firmId, ...challenge } = challengeData;

    // Find the firm and update the challenge
    const updatedFirms = firms.map((firm) => {
      if (firm.id === firmId) {
        return {
          ...firm,
          challenges: firm.challenges.map((c) =>
            c.id === challengeId ? { ...challenge, id: challengeId } : c
          ),
        };
      }
      return firm;
    });

    setFirms(updatedFirms);
  };

  const handleDeleteChallenge = (challengeId, firmId) => {
    // Find the firm and remove the challenge
    const updatedFirms = firms.map((firm) => {
      if (firm.id === firmId) {
        return {
          ...firm,
          challenges: firm.challenges.filter((c) => c.id !== challengeId),
        };
      }
      return firm;
    });

    setFirms(updatedFirms);
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

  const handleAddChallenge = (challengeData) => {
    const { firmId, ...challenge } = challengeData;

    // Find the firm and add the challenge
    const updatedFirms = firms.map((firm) => {
      if (firm.id === firmId) {
        return {
          ...firm,
          challenges: [
            ...(firm.challenges || []),
            { ...challenge, id: Date.now() },
          ],
        };
      }
      return firm;
    });

    setFirms(updatedFirms);
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
    {
      text: "Add Challenge",
      icon: <ChallengeIcon />,
      view: "challenge",
    },
  ];

  const drawer = (
    <Box>
      <Typography
        variant="h6"
        sx={{
          p: 2,
          mt: "90px",
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
                window.scrollTo({top: 10, behavior:"smooth"});
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
          mb:8,
        }}
      >
        {activeView === "add" ? (
          <AddFirmForm
            firm={editingFirm}
            onSubmit={handleAddFirm}
            onCancel={editingFirm ? handleCancelEdit : null}
          />
        ) : activeView === "view" ? (
          <ViewAllFirms
            firms={firms}
            onEdit={handleEditFirm}
            onDelete={handleDeleteFirm}
          />
        ) : activeView === "challenge" ? (
          <FirmChallengesEdit
            firms={firms}
            onSubmit={handleAddChallenge}
            onUpdateChallenge={handleUpdateChallenge}
            onDeleteChallenge={handleDeleteChallenge}
          />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default AdminPage;
