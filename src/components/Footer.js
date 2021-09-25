import {Box, Flex, Grid, HStack, Text} from "@chakra-ui/react";
import {FaDiscord, FaInstagram, FaTwitter} from "react-icons/all";

export default function Footer() {
    return (
        <Box>
            <Flex gridTemplateColumns={"1fr 1fr"}>
                <Text fontFamily={"Josefin Sans"} color={"black"}>©2021 - CWC</Text>
                <HStack ml={"auto"} spacing={3}>
                    <Box _hover={{color: "black", bgColor: "white", cursor: "pointer"}} transition={"200ms"} color={"white"} p={2} borderRadius={16} backgroundColor={"black"}>
                        <FaInstagram/>
                    </Box>
                    <Box _hover={{color: "black", bgColor: "white", cursor: "pointer"}} transition={"200ms"} color={"white"} p={2} borderRadius={16} backgroundColor={"black"}>
                        <FaDiscord/>
                    </Box>
                    <Box _hover={{color: "black", bgColor: "white", cursor: "pointer"}} transition={"200ms"} color={"white"} p={2} borderRadius={16} backgroundColor={"black"}>
                        <FaTwitter/>
                    </Box>
                </HStack>
            </Flex>
        </Box>
    )
}