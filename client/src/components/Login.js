import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";

const Login = () => {
  const handleChange = () => {};
  const handleLogin = () => {};
  return (
    <VStack spacing={4}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => handleChange(e)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          placeholder="Enter your Password"
          onChange={(e) => handleChange(e)}
        />
      </FormControl>
      <Button colorScheme="blue" w="100%" onClick={handleLogin}>
        Login
      </Button>
    </VStack>
  );
};

export default Login;
