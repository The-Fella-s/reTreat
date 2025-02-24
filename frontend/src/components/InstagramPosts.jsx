import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const swipeConfidenceThreshold = 100;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

const InstagramPosts = () => {

    // Page is the current index
    // Direction is the swipe direction, i.e. negative = backward, positive = forward.
    const [[page, direction], setPage] = useState([0, 0]);
    const [posts, setPosts] = useState([]);

    // Fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5000/api/instagram/posts",
                    { withCredentials: true }
                );
                setPosts(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPosts();
    }, []);

    if (!posts.length) {
        return <Typography>No posts available</Typography>;
    }

    const totalPosts = posts.length;
    // Make index wrap around instead of going over
    const imageIndex = ((page % totalPosts) + totalPosts) % totalPosts;
    const prevIndex = (imageIndex - 1 + totalPosts) % totalPosts;
    const nextIndex = (imageIndex + 1) % totalPosts;

    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
    };

    // Spring animation for the center big image
    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 30 },
        },
        exit: (direction) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 },
        }),
    };

    // Spring animation for the left and right smaller images
    const smallCardVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 150 : -150,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 30 },
        },
        exit: (direction) => ({
            x: direction > 0 ? -150 : 150,
            opacity: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 },
        }),
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                mt: 4,
                width: "100%",
            }}
        >
            <motion.div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "grab",
                    position: "relative",
                }}
            >
                {/* Left (Previous) Image */}
                <Box
                    sx={{
                        width: 150,
                        height: 200,
                        overflow: "hidden",
                        borderRadius: "10px",
                        opacity: 0.6,
                        position: "relative",
                    }}
                >
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.img
                            key={prevIndex}
                            src={posts[prevIndex]?.media_url}
                            alt="Previous"
                            custom={direction}
                            variants={smallCardVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            draggable={false}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                userSelect: "none",
                            }}
                        />
                    </AnimatePresence>
                </Box>

                {/* Center (Current) Image */}
                <Box
                    sx={{
                        width: 300,
                        height: 400,
                        overflow: "hidden",
                        borderRadius: "10px",
                        position: "relative",
                    }}
                >
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.img
                            key={page}
                            src={posts[imageIndex].media_url}
                            alt="Current"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);
                                if (swipe < -swipeConfidenceThreshold) {
                                    paginate(1);
                                } else if (swipe > swipeConfidenceThreshold) {
                                    paginate(-1);
                                }
                            }}
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                cursor: "grab",
                                userSelect: "none",
                                borderRadius: "10px",
                            }}
                        />
                    </AnimatePresence>
                </Box>

                {/* Right (Next) Image */}
                <Box
                    sx={{
                        width: 150,
                        height: 200,
                        overflow: "hidden",
                        borderRadius: "10px",
                        opacity: 0.6,
                        position: "relative",
                    }}
                >
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.img
                            key={nextIndex}
                            src={posts[nextIndex]?.media_url}
                            alt="Next"
                            custom={direction}
                            variants={smallCardVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            draggable={false}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                userSelect: "none",
                            }}
                        />
                    </AnimatePresence>
                </Box>
            </motion.div>
        </Box>
    );
};

export default InstagramPosts;
