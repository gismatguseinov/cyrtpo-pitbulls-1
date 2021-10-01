import {Box, Flex, HStack, Img, Spacer} from "@chakra-ui/react";
import logo from '../assets/slack.svg';
import {FaDiscord, FaInstagram, FaTwitter} from "react-icons/all";

export default function Navbar({}) {
    return (
        <Box zIndex={10} backgroundColor={"rgba(0, 0, 0, 0.5)"} py={4}>
            <Box w={["90%", "85%", "70%", "60%"]} mx={"auto"}>
                <Flex alignItems={"center"}>
                    <Img w={10} src={logo}/>
                    <Spacer/>
                    <Box ml={"auto"}>
                        <HStack spacing={3}>
                            <Box _hover={{color: "white", bgColor: "black", cursor: "pointer"}} transition={"200ms"} color={"black"} p={2} borderRadius={16} backgroundColor={"white"}>
                                <FaInstagram/>
                            </Box>
                            <Box _hover={{color: "white", bgColor: "black", cursor: "pointer"}} transition={"200ms"} color={"black"} p={2} borderRadius={16} backgroundColor={"white"}>
                                <FaDiscord/>
                            </Box>
                            <Box _hover={{color: "white", bgColor: "black", cursor: "pointer"}} transition={"200ms"} color={"black"} p={2} borderRadius={16} backgroundColor={"white"}>
                                <FaTwitter/>
                            </Box>
                        </HStack>
                    </Box>
                </Flex>
            </Box>
        </Box>
    )
}