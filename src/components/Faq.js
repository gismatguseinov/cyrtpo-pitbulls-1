import {Box, Text} from "@chakra-ui/react";
import {motion, AnimatePresence} from "framer-motion";
import {useState} from "react";

const SingleFaq = ({question, answer}) => {
    const [isExpanded, setIsExpanded] = useState();

    return (
        <Box textShadow={"2px 2px #000000"} color={"white"} w={"100%"} borderBottom={"1px solid #ccc"}>
            <Box _hover={{cursor: "pointer"}} py={5} onClick={() => setIsExpanded(!isExpanded)}>
                <Text fontFamily={"Josefin Sans"} fontWeight={"bold"}>{question}</Text>
            </Box>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div initial={{opacity: 0, maxHeight: 0}} animate={{opacity: 1, maxHeight: 100, duration: 200}}
                                exit={{opacity: 0, maxHeight: 0}}>
                        <Box pb={3}>
                            <Text fontFamily={"Roboto"}>{answer}</Text>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    )
}

export default function Faq({
                                faqs = [{question: "Salam", answer: "salam"}, {
                                    question: "Salam",
                                    answer: "salam"
                                }, {question: "Salam", answer: "salam"}, {
                                    question: "Salam",
                                    answer: "salam"
                                }, {question: "Salam", answer: "salam"}, {question: "Salam", answer: "salam"}]
                            }) {
    return (
        <Box w={"100%"}>
            {faqs.map((k, i) => <SingleFaq key={i} question={k.question} answer={k.answer}/>)}
        </Box>
    )
}