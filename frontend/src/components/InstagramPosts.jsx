import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const swipeConfidenceThreshold = 100;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

const InstagramPosts = () => {
    const [[page, direction], setPage] = useState([0, 0]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(
                    "/api/instagram/posts",
                    { withCredentials: true }
                );
                setPosts(res.data.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch posts.");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Loading state
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                <CircularProgress data-testid="loading-spinner" />
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Typography color="error" variant="h6" align="center" mt={4} data-testid="error-message">
                {error}
            </Typography>
        );
    }

    // Empty posts state
    if (!posts.length) {
        return (
            <Typography variant="h6" align="center" mt={4} data-testid="empty-message">
                No posts available
            </Typography>
        );
    }

    const totalPosts = posts.length;
    const imageIndex = ((page % totalPosts) + totalPosts) % totalPosts;
    const prevIndex = (imageIndex - 1 + totalPosts) % totalPosts;
    const nextIndex = (imageIndex + 1) % totalPosts;

    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
    };

    const centerVariants = {
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

    const smallVariants = {
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
                            variants={smallVariants}
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
                            data-testid="current-image"
                            alt="Current"
                            custom={direction}
                            variants={centerVariants}
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
                            variants={smallVariants}
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
