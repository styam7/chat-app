import { Box } from "@chakra-ui/layout";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../context/ChatContext";

const Chat = () => {
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" p="10px">
        {user && <MyChats />}
        {user && (
          <ChatBox />
        )}
      </Box>
    </div>
  );
};

export default Chat;