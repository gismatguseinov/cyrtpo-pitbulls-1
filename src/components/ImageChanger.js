import {Box, Img} from "@chakra-ui/react";
import img0 from "../assets/pic/8.webp";
import img1 from "../assets/pic/10.webp";
import img2 from "../assets/pic/11.webp";
import img3 from "../assets/pic/13.webp";
import img4 from "../assets/pic/14.webp";
import img5 from "../assets/pic/15.webp";
import img6 from "../assets/pic/20.webp";
import {useEffect, useState} from "react";


export default function ImageChanger() {
    const imgs = [img0, img1, img2, img3, img4, img5, img6];
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((current) => (current + 1) % imgs.length);
        }, 500)

        return () => clearInterval(interval);
    }, [])

    return (
        <Box>
            <Img boxShadow={"0px 0px 37px 8px rgba(0,0,0,0.75)"} borderRadius={16} w={"100%"} src={imgs[currentImage]}/>
        </Box>
    )
}