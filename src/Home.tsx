import {useEffect, useState} from "react";

import * as anchor from "@project-serum/anchor";

import {LAMPORTS_PER_SOL} from "@solana/web3.js";

import "./global.css";

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
import {motion} from 'framer-motion';

import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import img0 from "./assets/pic/8.webp";
import img1 from "./assets/pic/10.webp";
import img2 from "./assets/pic/11.webp";
import img3 from "./assets/pic/13.webp";
import img4 from "./assets/pic/14.webp";
import img5 from "./assets/pic/15.webp";
import img6 from "./assets/pic/20.webp";
import img7 from "./assets/pic/63.webp";
import img8 from "./assets/pic/90.webp";
import img9 from "./assets/pic/99.webp";

import bg from './assets/bg_11.webp';
import eye from "./assets/pit_blur.png";

import Faq from "./components/Faq";
import faqs from "./faqs";
import Footer from "./components/Footer";

import "@fontsource/josefin-sans";
import "@fontsource/roboto";
import ImageSetChanger from "./components/ImageSetChanger";
import PitbullDeck from "./components/PitbullDeck";


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
        <Box borderRadius={2}>
            <Heading fontFamily={"Josefin Sans"}>{props.heading}</Heading>
            {
                props.text !== "" && <Text fontFamily={"Roboto"} mt={6}>
                    {props.text}
                </Text>
            }
        </Box>
    )
}
const Home = (props: HomeProps) => {
    const toast = useToast();
    const [balance, setBalance] = useState<number>();
    const [isActive, setIsActive] = useState(false); // true when countdown completes
    const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
    const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
    const [isUpdated, setIsUpdated] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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
            setIsUpdated(!isUpdated);
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

            try {
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
            } catch (e) {
                setIsMobile(true);
                setIsLoading(false);
            }

        })();
    }, [wallet, props.candyMachineId, props.connection, isUpdated]);


    return (
        <Box backgroundSize={"99%"} backgroundPosition={"center"} backgroundColor={"black"} backgroundImage={bg}>
            <Box zIndex={100} w={"100%"} position={["fixed"]}>
                <Navbar/>
            </Box>
            <Box>
                <Box pt={24} height={["auto", "auto", "auto", "auto", "100vh"]} pb={10} w={["90%", "85%", "70%", "60%"]}
                     mx={"auto"}>
                    <Grid placeItems={"center"} gridTemplateColumns={"1fr"} height={"100%"}>
                        <Box>
                            <Grid gridGap={5} justifyContent={"space-around"} placeItems={"center"}
                                  gridTemplateColumns={["1fr", "1fr", "1fr", "1fr", "1fr 1fr"]}>
                                <motion.div initial={{opacity: 0, marginLeft: -1000}}
                                            animate={{opacity: 1, marginLeft: 0}}
                                            transition={{duration: 2}}>
                                    <ImageChanger/>
                                </motion.div>
                                <motion.div initial={{opacity: 0, marginRight: -1000}}
                                            animate={{opacity: 1, marginRight: 0}}
                                            transition={{duration: 2}}>
                                    <Grid w={"100%"} placeItems={"center"} gridTemplateColumns={"1fr"}>
                                        <Box textAlign={"center"}>
                                            <Heading fontSize={22} color={"white"}
                                                     fontFamily={"Josefin Sans"} textTransform={"uppercase"}>Welcome
                                                to the</Heading>
                                            <Box mt={10}>
                                                <Heading color={"white"}
                                                         fontFamily={"Josefin Sans"}
                                                         fontSize={[40, 80]}>REBELLIOUS</Heading>
                                                <Heading color={"white"}
                                                         fontFamily={"Josefin Sans"}
                                                         fontSize={[40, 80]}>DOGS</Heading>
                                                <Heading color={"white"}
                                                         fontFamily={"Josefin Sans"} fontSize={[40, 80]}>CLUB</Heading>
                                            </Box>
                                            <Box mt={10} display={"none"}>
                                                {
                                                    !isLoading && (
                                                        isMobile ? <Text color={"white"}
                                                                         fontFamily={"Josefin Sans"}
                                                            >You seem to be using a
                                                                mobile device</Text> :
                                                            isSoldOut ? (
                                                                    <Text color={"white"}
                                                                          fontFamily={"Josefin Sans"}>Solt
                                                                        Out!
                                                                        See
                                                                        Collection on Solanart.io
                                                                        of {itemsAvailable} bulls</Text>
                                                                ) :
                                                                <Text color={"white"}
                                                                      fontFamily={"Josefin Sans"}>Minted: {itemsRedeemed}/{itemsAvailable}</Text>
                                                    )
                                                }
                                                <Button onClick={isMobile || isSoldOut ? () => {
                                                    const url = new URL("https://solanart.io");
                                                    const win = window.open(url, "_blank");
                                                    if (win) win.focus();
                                                } : !wallet ? () => walletDialog.setOpen(true) : onMint}
                                                        fontFamily={"Josefin Sans"}
                                                        _hover={{bgColor: "white", color: "black"}} pt={1}
                                                        mt={3} borderRadius={8}
                                                        boxShadow={"0px 0px 37px 8px rgba(0,0,0,0.75)"}
                                                        isLoading={isMinting || isLoading}
                                                        bgColor={"black"}
                                                        color={"white"}>
                                                    {isMobile || isSoldOut ? "SOLANART" : wallet ? "MINT" : "CONNECT YOUR WALLET"}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </motion.div>
                            </Grid>
                        </Box>
                    </Grid>
                </Box>
                <Box backgroundColor={"rgba(0,0,0,0.5)"} py={10} backDropFilter={"blur(10px)"}>
                    <Box my={10} w={["90%", "85%", "70%", "60%"]} mx={"auto"}>
                        <Grid placeItems={"center"} gridTemplateColumns={"1fr"} height={"100%"}>
                            <Box>
                                <Box textAlign={"center"}>
                                    <Heading color={"white"} fontFamily={"Josefin Sans"}
                                             fontSize={[40, 60]}>Rebellious Dogs Club Collection</Heading>
                                </Box>
                                <Box w={["90%", "70%"]} mx={"auto"} mt={3}>
                                    <Text color={"white"} fontFamily={"Roboto"} textAlign={"center"} fontSize={[16, 20]}>
                                        Rebellious Dogs are Collection of 7777 NFTs on Solana Blockchain. Dogs are 3D characters with over 60 unique attributes. The uniqueness of the attributes are that each of them
                                        are built as 3D sculpted and hand-drawn.
                                    </Text>
                                </Box>
                                <Box w={"fit-content"} mx={"auto"} mt={3}>
                                    <Button boxShadow={"0px 0px 37px 8px rgba(0,0,0,0.75)"}
                                            fontFamily={"Josefin Sans"} _hover={{bgColor: "black", color: "white"}}
                                            pt={1} mt={3}
                                            borderRadius={8} bgColor={"white"}
                                            color={"black"}>JOIN DISCORD</Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Box>
                </Box>
                <Box bgRepeat={"no-repeat"}>
                    <Box h={["auto", "auto", "auto"]} w={["90%", "85%", "70%", "60%"]} mx={"auto"}>
                        <Grid placeItems={"center"} gridTemplateColumns={"1fr"} py={40} height={"100%"}>
                            <Box>
                                <Box textAlign={"center"}>
                                    <Heading color={"white"} fontSize={[40, 60]}
                                             fontFamily={"Josefin Sans"} textTransform={"uppercase"}>MEET THE
                                        NFT</Heading>
                                    <Heading color={"white"} fontSize={[40, 60]}
                                             fontFamily={"Josefin Sans"}
                                             textTransform={"uppercase"}>DOGS</Heading>
                                </Box>
                                <Box w={["90%", "70%"]} mx={"auto"} mt={3}>
                                    <Text color={"white"} fontFamily={"Roboto"}
                                          textAlign={"center"} fontSize={[16, 20]}>
                                        7777 Randomly Generated 3D Characters with over 60 unique attributes
                                    </Text>
                                </Box>
                                <Box mt={10}>
                                    <ImageSetChanger/>
                                </Box>
                            </Box>
                        </Grid>
                    </Box>
                </Box>
                <Box backgroundColor={"rgba(0,0,0,0.5)"}>
                    <Box pb={10} mt={[10, 10, 10, 10, 0]} mx={"auto"}>
                        <Flex justifyContent={"center"} alignItems={"center"} height={"100%"}>
                            <Box pt={20}>
                                <Box textAlign={"center"}>
                                    <Heading color={"white"} fontFamily={"Josefin Sans"}
                                             fontSize={60}>THE NFT</Heading>
                                    <Heading color={"white"} fontFamily={"Josefin Sans"}
                                             fontSize={60}>ROADMAP</Heading>
                                </Box>
                                <Box mx={"auto"} py={10}>
                                    <Box>
                                        <VerticalTimeline>
                                            <VerticalTimelineElement
                                                iconStyle={{background: 'black', color: '#fff', padding: "1px"}}
                                                icon={<Text fontSize={"25pt"} mt={2} textAlign={"center"}>0%</Text>}
                                            >
                                                <RoadMapComp heading={"Rebellious Dogs Club Established"}
                                                             text={"The team of 14 people worked hard together to create the ultime, the most rebellious dogs that the NFT market has ever seen"}/>
                                            </VerticalTimelineElement>
                                            <VerticalTimelineElement
                                                className="vertical-timeline-element--work"
                                                iconStyle={{background: 'black', color: '#fff'}}
                                            >
                                                <RoadMapComp heading={"7777 Rebellious Dogs Club NFTs Produced"}
                                                             text={""}/>
                                            </VerticalTimelineElement>
                                            <VerticalTimelineElement
                                                className="vertical-timeline-element--work"
                                                iconStyle={{background: 'black', color: '#fff'}}
                                            >
                                                <RoadMapComp heading={"7777 Rebellious Dogs Club NFTs will be sold."}
                                                             text={""}/>
                                            </VerticalTimelineElement>
                                            <VerticalTimelineElement
                                                className="vertical-timeline-element--work"
                                                iconStyle={{background: 'black', color: '#fff'}}
                                            >
                                                <RoadMapComp heading={"2nd Market Listings"}
                                                             text={""}/>
                                            </VerticalTimelineElement>
                                            <VerticalTimelineElement
                                                className="vertical-timeline-element--education"
                                                iconStyle={{background: 'black', color: '#fff'}}
                                            >
                                                <RoadMapComp heading={"Community Events"}
                                                             text={""}/>
                                            </VerticalTimelineElement>
                                            <VerticalTimelineElement
                                                className="vertical-timeline-element--education"
                                                iconStyle={{background: 'black', color: '#fff'}}
                                            >
                                                <RoadMapComp heading={"Weekly Buy&Back with 25% Fees"}
                                                             text={""}/>
                                            </VerticalTimelineElement>
                                            <VerticalTimelineElement
                                                className="vertical-timeline-element--education"
                                                iconStyle={{background: 'black', color: '#fff'}}
                                            >
                                                <RoadMapComp heading={"Distribution of 25% Fee to Holders"}
                                                             text={""}/>
                                            </VerticalTimelineElement>
                                        </VerticalTimeline>

                                    </Box>
                                </Box>
                            </Box>
                        </Flex>
                    </Box>
                </Box>
            </Box>
            <Box pb={12} bgColor={"black"}>
                <Box py={30} w={["90%", "85%", "70%", "60%"]} mx={"auto"} display={"none"}>
                    <Box textAlign={"center"}>
                        <Heading textShadow={"2px 2px #000000"} color={"white"} fontFamily={"Josefin Sans"}
                                 fontSize={60}>GET THE FAQS</Heading>
                    </Box>
                    <Box w={"100%"} h={'auto'} mx={"auto"}>
                        <Faq faqs={faqs}/>
                    </Box>
                </Box>
            </Box>
            <Box bgColor={"black"} borderTop={"1px solid white"}>
                <Box w={["90%", "85%", "70%", "60%"]} py={4} color={"white"} mx={"auto"}>
                    <Footer/>
                </Box>
            </Box>
        </Box>
    )
};

export default Home;
