import {Grid, Img} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import img0 from "../assets/pic/8.webp";
import img1 from "../assets/pic/90.webp";
import img2 from "../assets/pic/99.webp";
import img3 from "../assets/pic/13.webp";
import img4 from "../assets/pic/14.webp";
import img5 from "../assets/pic/15.webp";
import img6 from "../assets/pic/20.webp";

export default function ImageSetChanger() {

    const [currentSet, setCurrentSet] = useState(0);


    const set0 = [img0, img4, img2, img3];
    const set1 = [img1, img2, img0, img4];
    const set2 = [img4, img1, img3, img6];
    const set3 = [img6, img5, img0, img4];

    const sets = [set0, set1, set2, set3];

    useEffect(() => {

        const interval = setInterval(() => {
            setCurrentSet((current) => (current + 1) % sets.length);
        }, 500)

        return () => clearInterval(interval);
    }, [])

    return (
        <Grid gridGap={5} gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr 1fr 1fr"]}>
            {
                sets[currentSet].map(k => <Img boxShadow={"0px 0px 37px 8px rgba(0,0,0,0.75)"} borderRadius={16} src={k}/>)
            }
        </Grid>
    )
}