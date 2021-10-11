import {Grid, Img} from "@chakra-ui/react";
import {useEffect, useState} from "react";

import img2 from '../assets/pic/2.webp';
import img3 from '../assets/pic/3.webp';
import img4 from '../assets/pic/4.webp';
import img5 from '../assets/pic/5.webp';


export default function ImageSetChanger() {

    const [currentSet, setCurrentSet] = useState(0);


    const set0 = [img3, img4, img2, img4];
    const set1 = [img2, img3, img2, img4];
    const set2 = [img4, img5, img3, img2];
    const set3 = [img3, img5, img2, img4];

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