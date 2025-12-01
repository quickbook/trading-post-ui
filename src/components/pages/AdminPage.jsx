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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import ChallengeIcon from "@mui/icons-material/EmojiEvents";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AddFirmForm from "../sections/AddFirmForm";
import ViewAllFirms from "../sections/ViewAllFirms";
import FirmChallengesEdit from "../sections/FirmChallengesEdit";
import { MainContext } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentFirm,
  selectFirms,
} from "../../features/firms/firmsSelectors";
import {
  createFirm,
  deleteFirm,
  fetchFirmById,
  fetchFirmsData,
  updateFirm,
} from "../../features/firms/firmsSlice";
import { fetchAllDomainData } from "../../features/domain/domainDataSlice";
import {
  createChallenge,
  deleteChallenge,
  fetchChallenges,
  updateChallenge,
} from "../../features/challenges/challengesSlice";
import AdminRegisterPage from "./AdminRegisterPage";
import { selectRole, selectUser } from "../../features/auth/loginSlice";

const drawerWidth = "320px";

const AdminPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Views
  const [activeView, setActiveView] = useState("add");

  // Local edit state used for AddFirmForm (we pass firm object to the form)
  const [editingFirmLocal, setEditingFirmLocal] = useState(null);

  // Delete confirmations
  const [firmToDelete, setFirmToDelete] = useState(null);
  const [deleteFirmDialogOpen, setDeleteFirmDialogOpen] = useState(false);

  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [deleteChallengeDialogOpen, setDeleteChallengeDialogOpen] =
    useState(false);

  // Redux selectors
  //const firms = useSelector((st) => st.firms.content || []);
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const currentFirmDetails = useSelector(selectCurrentFirm);
  const firmsStatus = useSelector((st) => st.firms.status.firms);
  const challenges = useSelector((st) => st.challenges.data) || [];
  const challengesStatus = useSelector((st) => st.challenges.status);
  const { setSnackbarMessage, setSnackbarOpen, setSnackbarSeverity } =
    React.useContext(MainContext);

  const initDomainData = React.useRef(false);
  const initChallenges = React.useRef(false);
  const initCurrentFirm = React.useRef(false);

  useEffect(() => {
    if (!initDomainData.current) {
      dispatch(fetchAllDomainData());
      initDomainData.current = true;
    }
    if (!initChallenges.current) {
      dispatch(fetchChallenges());
      initChallenges.current = true;
    }
  }, []);

  // useEffect(() => {
  //   if (editingFirmLocal) {
  //     dispatch(fetchFirmById(editingFirmLocal.id));
  //   }
  // }, [editingFirmLocal]);
  useEffect(() => {
    window.scrollTo({ top: 20, behavior: "smooth" });
  }, [activeView]);

  const handleAddOrUpdateFirm = async (finalFormData) => {
    let isSuccess = false;

    try {
      if (editingFirmLocal?.id) {
        // --- UPDATE ----
        await dispatch(
          updateFirm({ id: editingFirmLocal.id, firmData: finalFormData })
        ).unwrap();

        setSnackbarMessage(
          `Firm ID: ${editingFirmLocal.id} updated successfully`
        );
        setSnackbarSeverity("success");
        isSuccess = true;
      } else {
        // --- CREATE ----
        await dispatch(createFirm(finalFormData)).unwrap();

        setSnackbarMessage("Firm created successfully");
        setSnackbarSeverity("success");
        isSuccess = true;
      }
    } catch (err) {
      console.error("Firm submit error:", err);

      const firmName = editingFirmLocal?.name || "Firm";
      const errorMessage = editingFirmLocal?.id
        ? `Failed to update ${firmName}`
        : `Failed to create new firm`;

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    }

    setSnackbarOpen(true);

    // Only refresh and navigate if the operation succeeded
    if (isSuccess) {
      await dispatch(fetchFirmsData());
      setEditingFirmLocal(null);
      setActiveView("view");
    }
  };

  const handleEditFirm = async (firm) => {
    // pass the object to AddFirmForm to pre-fill
    await dispatch(fetchFirmById(firm.id))
      .unwrap()
      .then((e) => {
        setEditingFirmLocal(e.data);
      });
    setActiveView("add");
  };

  const handleDeleteFirmRequest = (firmId) => {
    setFirmToDelete(firmId);
    setDeleteFirmDialogOpen(true);
  };

  const handleConfirmDeleteFirm = async () => {
    if (!firmToDelete) return;
    try {
      await dispatch(deleteFirm(firmToDelete)).unwrap();
      setSnackbarMessage("Firm Id:" + firmToDelete + " Deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Delete firm failed:", err);
      setSnackbarMessage("Failed to delete firm");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      // optionally show toast/snackbar
    } finally {
      setDeleteFirmDialogOpen(false);
      setFirmToDelete(null);
      // refresh firms and challenges (if challenges are attached/need refresh)
      dispatch(fetchFirmsData());
      dispatch(fetchChallenges());
      setActiveView("view");
    }
  };

  // ===== Challenges handlers =====
  const handleAddChallenge = async (challengeData) => {
    // challengeData expected to contain firmId (as in FirmChallengesEdit)
    try {
      await dispatch(createChallenge(challengeData)).unwrap();
      setSnackbarMessage("Challenge created successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Create challenge failed:", err);
      setSnackbarMessage("Failed to create firm challenge");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      dispatch(fetchChallenges());
      //dispatch(fetchFirmsData()); // if your backend stores challenges inside firm object
      //setActiveView("view");
    }
  };

  const handleUpdateChallenge = async (challengeId, updatedData) => {
    try {
      await dispatch(
        updateChallenge({ id: challengeId, updatedData })
      ).unwrap();
      setSnackbarMessage(
        "Challenge Id:" + challengeId + " updated successfully"
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Update challenge failed:", err);
      setSnackbarMessage("Failed to update challenge");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      dispatch(fetchChallenges());
      dispatch(fetchFirmsData());
    }
  };

  const handleDeleteChallengeRequest = (challengeId, firmId) => {
    setChallengeToDelete({ challengeId, firmId });
    setDeleteChallengeDialogOpen(true);
  };

  const handleConfirmDeleteChallenge = async () => {
    if (!challengeToDelete) return;
    try {
      await dispatch(deleteChallenge(challengeToDelete.challengeId)).unwrap();
      setSnackbarMessage(
        "Challenge Id:" +
          challengeToDelete.challengeId +
          " deleted successfully"
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Delete challenge failed:", err);
      setSnackbarMessage("Failed to delete challenge");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setDeleteChallengeDialogOpen(false);
      setChallengeToDelete(null);
      dispatch(fetchChallenges());
      dispatch(fetchFirmsData());
    }
  };

  // Sidebar menu
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
    (role === "ROOT" &&{
      text: "Register Admin",
      icon: <SupervisorAccountIcon />,
      view: "admin",
    }),
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
                setEditingFirmLocal(null);
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
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={false}
            onClose={() => {}}
            ModalProps={{ keepMounted: true }}
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
          mb: 8,
        }}
      >
        {activeView === "add" ? (
          <AddFirmForm
            firm={editingFirmLocal}
            onSubmit={handleAddOrUpdateFirm}
            onCancel={() => {
              setEditingFirmLocal(null);
              setActiveView("view");
            }}
          />
        ) : activeView === "view" ? (
          <ViewAllFirms
            //firms={firms}
            onEdit={(f) => handleEditFirm(f)}
            onDelete={(id) => handleDeleteFirmRequest(id)}
          />
        ) : activeView === "challenge" ? (
          <FirmChallengesEdit
            allChallenges={challenges}
            onSubmit={handleAddChallenge}
            onUpdateChallenge={handleUpdateChallenge}
            onDeleteChallenge={(challengeId, firmId) =>
              handleDeleteChallengeRequest(challengeId, firmId)
            }
          />
        ) : activeView === "admin" ? (
          <AdminRegisterPage />
        ) : (
          <></>
        )}
      </Box>

      {/* Firm Delete Confirm */}
      <Dialog
        open={deleteFirmDialogOpen}
        onClose={() => setDeleteFirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this firm? This action is
            irreversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteFirmDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDeleteFirm}
          >
            Delete Firm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Challenge Delete Confirm */}
      <Dialog
        open={deleteChallengeDialogOpen}
        onClose={() => setDeleteChallengeDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this challenge? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteChallengeDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDeleteChallenge}
          >
            Delete Challenge
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;
