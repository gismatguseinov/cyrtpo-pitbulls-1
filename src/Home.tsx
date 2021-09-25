import {useEffect, useState} from "react";

import * as anchor from "@project-serum/anchor";

import {LAMPORTS_PER_SOL} from "@solana/web3.js";

import {useAnchorWallet} from "@solana/wallet-adapter-react";
import {useWalletDialog} from "@solana/wallet-adapter-material-ui";

import {
    CandyMachine,
    awaitTransactionSignatureConfirmation,
    getCandyMachineState,
    mintOneToken,
    shortenAddress,
} from "./candy-machine";
import {Box, Button, Flex, Grid, Heading, Img, Text, useToast} from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import ImageChanger from "./components/ImageChanger";

import img0 from "./assets/pic/0.webp";
import img1 from "./assets/pic/1.webp";
import img2 from "./assets/pic/2.webp";
import img3 from "./assets/pic/3.webp";
import img4 from "./assets/pic/4.webp";
import img5 from "./assets/pic/5.webp";
import img6 from "./assets/pic/6.webp";

import bg from './assets/bg.jpeg';

import Faq from "./components/Faq";
import faqs from "./faqs";
import Footer from "./components/Footer";

import "@fontsource/josefin-sans";
import "@fontsource/roboto";


export interface HomeProps {
    candyMachineId: anchor.web3.PublicKey;
    config: anchor.web3.PublicKey;
    connection: anchor.web3.Connection;
    startDate: number;
    treasury: anchor.web3.PublicKey;
    txTimeout: number;
}

interface RoadMapCompProps {
    heading: string;
    text: string;
}

const RoadMapComp = (props: RoadMapCompProps) => {
    return (
        <Box boxShadow={"2xl"} textShadow={"2px 2px #000000"} color={"white"} padding={6} borderRadius={2} border={"1px solid #ccc"}>
            <Heading fontFamily={"Josefin Sans"}>{props.heading}</Heading>
            <Text fontFamily={"Roboto"} mt={6}>
                {props.text}
            </Text>
        </Box>
    )
}

const Home = (props: HomeProps) => {
    const toast = useToast();
    const [balance, setBalance] = useState<number>();
    const [isActive, setIsActive] = useState(false); // true when countdown completes
    const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
    const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

    const [isLoading, setIsLoading] = useState(true);

    const walletDialog = useWalletDialog();

    const [itemsRedeemed, setItemsRedeemed] = useState(0);
    const [itemsAvailable, setItemsAvailable] = useState(0);


    const wallet = useAnchorWallet();
    const [candyMachine, setCandyMachine] = useState<CandyMachine>();

    const onMint = async () => {
        try {
            setIsMinting(true);
            if (wallet && candyMachine?.program) {
                const mintTxId = await mintOneToken(
                    candyMachine,
                    props.config,
                    wallet.publicKey,
                    props.treasury
                );

                const status = await awaitTransactionSignatureConfirmation(
                    mintTxId,
                    props.txTimeout,
                    props.connection,
                    "singleGossip",
                    false
                );

                if (!status?.err) {
                    toast({description: "Congratulations! Mint succeeded!", status: "success"})
                } else {
                    toast({description: "Mint failed! Please try again!", status: "error"})
                }
            }
        } catch (error: any) {
            // TODO: blech:
            let message = error.msg || "Minting failed! Please try again!";
            let status = "error";
            if (!error.msg) {
                if (error.message.indexOf("0x138")) {
                } else if (error.message.indexOf("0x137")) {
                    status = 'warning';
                    message = `SOLD OUT!`;
                } else if (error.message.indexOf("0x135")) {
                    status = "error";
                    message = `Insufficient funds to mint. Please fund your wallet.`;
                }
            } else {
                if (error.code === 311) {
                    message = `SOLD OUT!`;
                    setIsSoldOut(true);
                } else if (error.code === 312) {
                    status = "warning"
                    message = `Minting period hasn't started yet.`;
                }
            }


            // @ts-ignore
            toast({description: message, status: status})

        } finally {
            if (wallet) {
                const balance = await props.connection.getBalance(wallet.publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
            }
            setIsMinting(false);
        }
    };

    useEffect(() => {
        (async () => {
            if (wallet) {
                const balance = await props.connection.getBalance(wallet.publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
            }
        })();
    }, [wallet, props.connection]);

    useEffect(() => {
        (async () => {

            const {
                candyMachine, goLiveDate, itemsRemaining, itemsAvailable,
                itemsRedeemed,
            } =
                await getCandyMachineState(
                    wallet as anchor.Wallet,
                    props.candyMachineId,
                    props.connection
                );

            setIsSoldOut(itemsRemaining === 0);
            setCandyMachine(candyMachine);
            setItemsRedeemed(itemsRedeemed);
            setItemsAvailable(itemsAvailable);
            setIsLoading(false);
        })();
    }, [wallet, props.candyMachineId, props.connection,]);


    return (
        <Box>
            <Box w={"100%"} position={"fixed"}>
                <Navbar/>
            </Box>
            <Box backgroundSize={"cover"} backgroundImage={bg}>
                <Box __css={{height: "calc(100vh - 92px)"}} w={["90%", "85%", "70%", "60%"]} mx={"auto"}>
                    <Flex justifyContent={"center"} alignItems={"center"} height={"100%"}>
                        <Box>
                            <Grid gridTemplateColumns={"1fr 1fr"}>
                                <Box w={"100%"}>
                                    <ImageChanger/>
                                </Box>
                                <Flex w={"100%"} alignItems={"center"} justifyContent={"center"}>
                                    <Box textAlign={"center"}>
                                        <Heading fontSize={22} color={"white"} textShadow={"2px 2px #000000"} fontFamily={"Josefin Sans"} textTransform={"uppercase"}>Welcome
                                            to the</Heading>
                                        <Box mt={10}>
                                            <Heading textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Josefin Sans"} fontSize={80}>CRYPTO</Heading>
                                            <Heading textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Josefin Sans"} fontSize={80}>WILDLINGS</Heading>
                                            <Heading textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Josefin Sans"} fontSize={80}>OF THE</Heading>
                                            <Heading textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Josefin Sans"} fontSize={80}>DAWN</Heading>
                                        </Box>
                                        <Box mt={10}>
                                            {
                                                !isLoading && (
                                                    isSoldOut ? (
                                                            <Text textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Josefin Sans"} fontStyle={"italic"}>Solt Out! See
                                                                Collection on Solanart.io of {itemsAvailable} bulls</Text>
                                                        ) :
                                                        <Text textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Josefin Sans"} fontStyle={"italic"}>{itemsRedeemed}/{itemsAvailable}</Text>
                                                )
                                            }
                                            <Button onClick={isSoldOut ? () => {
                                                const url = new URL("https://solanart.io");
                                                const win = window.open(url, "_blank");
                                                if(win) win.focus();
                                            } : !wallet ? () => walletDialog.setOpen(true) : onMint} fontFamily={"Josefin Sans"} _hover={{bgColor: "#262626"}} pt={1}
                                                    mt={3} borderRadius={0}
                                                    isLoading={isMinting || isLoading}
                                                    bgColor={"black"}
                                                    color={"white"}>
                                                { isSoldOut ? "SOLANART" :  wallet ? "MINT" : "CONNECT"}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Flex>
                            </Grid>
                        </Box>
                    </Flex>
                </Box>
                <Box __css={{height: "100vh"}} w={["90%", "85%", "70%", "60%"]} mx={"auto"}>
                    <Flex justifyContent={"center"} alignItems={"center"} height={"100%"}>
                        <Box>
                            <Box textAlign={"center"}>
                                <Heading textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Josefin Sans"} fontSize={60}>Lorem Ipsum</Heading>
                                <Heading textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Josefin Sans"} fontSize={60}>Sit Dolor &</Heading>
                                <Heading textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Josefin Sans"} fontSize={60}>Ametsaltabme</Heading>
                            </Box>
                            <Box w={["70%"]} mx={"auto"} mt={3}>
                                <Text color={"white"} fontFamily={"Roboto"} textAlign={"center"} fontSize={20}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu velit id erat
                                    posuere
                                    convallis. Nam vestibulum, massa ut ultrices rutrum, augue nisl tincidunt sem, quis
                                    ornare
                                    nulla justo at arcu. Mauris consectetur dictum turpis non ultricies. Cras
                                    pellentesque
                                    ligula sit amet mi tristique gravida. Curabitur tempus lacus lacus, a elementum arcu
                                    faucibus ut. Quisque in ullamcorper tortor, eu iaculis sapien. Nunc at laoreet enim.
                                    Donec
                                    vehicula lobortis tempor.
                                </Text>
                            </Box>
                            <Box w={"fit-content"} mx={"auto"} mt={3}>
                                <Button fontFamily={"Josefin Sans"} _hover={{bgColor: "#262626"}} pt={1} mt={3}
                                        borderRadius={0} bgColor={"black"}
                                        color={"white"}>JOIN DISCORD</Button>
                            </Box>
                        </Box>
                    </Flex>
                </Box>
                <Box __css={{height: "100vh"}} w={["90%", "85%", "70%", "60%"]} mx={"auto"}>
                    <Flex justifyContent={"center"} alignItems={"center"} height={"100%"}>
                        <Box>
                            <Box textAlign={"center"}>
                                <Heading textShadow={"2px 2px #000000"} color={"white"} fontSize={60} fontFamily={"Josefin Sans"} textTransform={"uppercase"}>Meet the
                                    nft</Heading>
                                <Heading textShadow={"2px 2px #000000"} color={"white"} fontSize={60} fontFamily={"Josefin Sans"}
                                         textTransform={"uppercase"}>Bulls</Heading>
                            </Box>
                            <Box w={["70%"]} mx={"auto"} mt={3}>
                                <Text textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Roboto"} textAlign={"center"} fontSize={25}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu velit id erat
                                    posuere
                                    convallis. Nam vestibulum, massa ut ultrices rutrum, augue nisl tincidunt sem, quis
                                    ornare
                                    nulla justo at arcu. Mauris consectetur dictum turpis non ultricies. Cras
                                    pellentesque
                                </Text>
                            </Box>
                            <Box mt={10}>
                                <Grid gridGap={5} gridTemplateColumns={"1fr 1fr 1fr 1fr"}>
                                    <Img boxShadow={"2xl"} src={img0}/>
                                    <Img boxShadow={"2xl"} src={img4}/>
                                    <Img boxShadow={"2xl"} src={img2}/>
                                    <Img boxShadow={"2xl"} src={img3}/>
                                </Grid>
                            </Box>
                        </Box>
                    </Flex>
                </Box>
                <Box __css={{height: "100vh"}} w={["90%", "85%", "70%", "60%"]} mx={"auto"}>
                    <Flex justifyContent={"center"} alignItems={"center"} height={"100%"}>
                        <Box pt={6}>
                            <Box textAlign={"center"}>
                                <Heading textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Josefin Sans"} fontSize={60}>THE NFT</Heading>
                                <Heading textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Josefin Sans"} fontSize={60}>ROADMAP</Heading>
                            </Box>
                            <Box mx={"auto"} mt={3}>
                                <Grid gridGap={5} gridTemplateColumns={"1fr 1fr"}>
                                    <RoadMapComp heading={"COLLABORATIONS"}
                                                 text={"Our team of artists and developers will be working in a collaborative effort to merge CCC with leading brands in the cannabis industry to create exclusive merchandise for NFTokin holders. Our merchandise store is currently being built out and will host CCC branded merchandise as well"}/>
                                    <RoadMapComp heading={"PODCAST"}
                                                 text={"Our team of artists and developers will be working in a collaborative effort to merge CCC with leading brands in the cannabis industry to create exclusive merchandise for NFTokin holders. Our merchandise store is currently being built out and will host CCC branded merchandise as well as limited collaborations. Stay tuned for collaboration announcements in the discord."}/>
                                    <RoadMapComp heading={"TRADE SHOWS"}
                                                 text={"Our team of artists and developers will be working in a collaborative effort to merge CCC with leading brands in the cannabis industry to create exclusive merchandise for NFTokin holders. Our merchandise store is currently being built out and "}/>
                                    <RoadMapComp heading={"GAMIFICATION"}
                                                 text={"Our team of artists and developers will be working in a collaborative effort to merge CCC with leading brands in the cannabis industry to create exclusive merchandise for NFTokin holders. Our merchandise store is currently being built out and will host CCC branded merchandise as well as limited collaborations. "}/>
                                </Grid>
                            </Box>
                        </Box>
                    </Flex>
                </Box>
                <Box pt={40} w={["90%", "85%", "70%", "60%"]} mx={"auto"}>
                    <Box textAlign={"center"}>
                        <Heading textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Josefin Sans"} fontSize={60}>GET THE FAQS</Heading>
                    </Box>
                    <Box w={"100%"} h={1000} mx={"auto"}>
                        <Faq faqs={faqs}/>
                    </Box>
                </Box>
            </Box>
            <Box bgColor={"black"}>
                <Box w={["90%", "85%", "70%", "60%"]} py={10} color={"white"} mx={"auto"}>
                    <Footer/>
                </Box>
            </Box>
        </Box>
    )

    // return (
    //     <Box>
    //         {wallet && (
    //             <Text>Address: {shortenAddress(wallet.publicKey.toBase58() || "")}</Text>
    //         )}
    //
    //         {wallet && (
    //             <Text>Balance: {(balance || 0).toLocaleString()} SOL</Text>
    //         )}
    //
    //         <Box>
    //             {!wallet ? (
    //                 <Button onClick={() => walletDialog.setOpen(true)}>Connect Wallet</Button>
    //             ) : (
    //                 <Box>
    //                     <p>{itemsRedeemed}/{itemsAvailable}</p>
    //                     <Button
    //                         disabled={isSoldOut || isMinting || !isActive}
    //                         onClick={onMint}
    //                     >
    //                         {isSoldOut ? "SOLD OUT" : "MINT"}
    //                     </Button>
    //                 </Box>
    //             )}
    //         </Box>
    //     </Box>
    // );
};

export default Home;
