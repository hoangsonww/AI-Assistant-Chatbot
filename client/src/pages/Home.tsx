import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import { getConversations, isAuthenticated } from "../services/api";
import { IConversation } from "../types/conversation";

interface HomeProps {
  onToggleTheme: () => void;
  darkMode: boolean;
}

/**
 * The Home component
 *
 * @param onToggleTheme The toggle theme function
 * @param darkMode The dark mode state
 * @constructor The Home component
 */
const Home: React.FC<HomeProps> = ({ onToggleTheme, darkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // On mobile, default the sidebar to closed; on desktop open it.
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  /**
   * Toggle the sidebar open state
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * Load the conversations from the API
   */
  const loadConversations = async () => {
    setLoading(true);
    try {
      if (isAuthenticated()) {
        const resp = await getConversations();
        setConversations(resp);
      } else {
        setConversations([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  /**
   * Handle selecting a conversation
   *
   * @param id The conversation ID
   */
  const handleSelectConversation = (id: string | null) => {
    setSelectedConversationId(id);
  };

  /**
   * Handle creating a new conversation
   *
   * @param conv The new conversation
   */
  const handleNewConversation = (conv: IConversation) => {
    setSelectedConversationId(conv._id);
    loadConversations();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      bgcolor={theme.palette.background.default}
      sx={{ transition: "background-color 0.3s ease" }}
    >
      <Navbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
        onRefreshConversations={loadConversations}
        onSelectConversation={handleSelectConversation}
        onToggleTheme={onToggleTheme}
        darkMode={darkMode}
        setConversations={setConversations}
      />
      <Box display="flex" flex="1" overflow="hidden">
        <Sidebar
          open={sidebarOpen}
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversationId}
          onRefresh={loadConversations}
          isMobile={isMobile}
          loadingConversations={loading}
        />
        {/* Fix ChatArea container to have a fixed height and hidden overflow */}
        <Box
          flex="1"
          sx={{
            height: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <ChatArea
            conversationId={selectedConversationId}
            onNewConversation={handleNewConversation}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
