import { Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";

const SignUp = () => {
  const handleChange = () => {};
  const handleSignUp = () => {}
  return (
    <VStack spacing={4}>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => handleChange(e)}
        />
      </FormControl>
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
      <FormControl id="confirm_password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          placeholder="Re-enter your Password"
          onChange={(e) => handleChange(e)}
        />
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel>Picture</FormLabel>
        <Input
          type="file"
          placeholder="Re-enter your Password"
          onChange={(e) => handleChange(e)}
        />
      </FormControl>
      <Button colorScheme="blue" w="100%" onClick={handleSignUp}>
         Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
