import {Box, Flex, Grid, HStack, Text} from "@chakra-ui/react";
import {FaDiscord, FaInstagram, FaTwitter} from "react-icons/all";

export default function Footer() {
    return (
        <Box>
            <Grid alignItems={"center"} gridTemplateColumns={"1fr 1fr"}>
                <Text fontFamily={"Josefin Sans"} color={"white"}>©2021 - CWC</Text>
                <HStack ml={"auto"} spacing={3}>
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
            </Grid>
        </Box>
    )
}