import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
                // Only include posts that have a media_url
                const validPosts = res.data.data.filter(post => post.media_url);
                setPosts(validPosts);
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

    // Helper function to render media if media_url exists.
    const renderMedia = (post, uniqueKey, additionalProps = {}) => {
        const mediaUrl = post?.media_url;
        if (!mediaUrl) return null;
        const commonProps = {
            src: mediaUrl,
            alt: "Media",
            custom: direction,
            initial: "enter",
            animate: "center",
            exit: "exit",
            style: {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                userSelect: "none",
                borderRadius: "10px",
            },
            ...additionalProps,
        };

        if (mediaUrl.includes(".mp4")) {
            return (
                <motion.video
                    key={uniqueKey}
                    {...commonProps}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            );
        } else {
            return <motion.img key={uniqueKey} {...commonProps} />;
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 4,
            }}
        >
            <Box
                component={motion.div}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    cursor: "grab",
                    position: "relative",
                }}
            >
                {/* Left (Previous) Media, hidden on mobile */}
                <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column", alignItems: "center" }}>
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
                            {renderMedia(posts[prevIndex], prevIndex, { variants: smallVariants })}
                        </AnimatePresence>
                    </Box>
                    <IconButton onClick={() => paginate(-1)} sx={{ mt: 3 }}>
                        <ArrowBackIosIcon />
                    </IconButton>
                </Box>

                {/* Center */}
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
                        {posts[imageIndex]?.media_url ? (
                            posts[imageIndex].media_url.includes(".mp4") ? (
                                <motion.video
                                    key={page}
                                    src={posts[imageIndex].media_url}
                                    data-testid="current-image"
                                    alt="Current Media"
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
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
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
                            ) : (
                                <motion.img
                                    key={page}
                                    src={posts[imageIndex].media_url}
                                    data-testid="current-image"
                                    alt="Current Media"
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
                            )
                        ) : null}
                    </AnimatePresence>
                </Box>

                {/* Right (Next) Media, hidden on mobile */}
                <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column", alignItems: "center" }}>
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
                            {renderMedia(posts[nextIndex], nextIndex, { variants: smallVariants })}
                        </AnimatePresence>
                    </Box>
                    <IconButton onClick={() => paginate(1)} sx={{ mt: 3 }}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Swipe hint, only on mobile */}
            <Box sx={{ display: { xs: "block", sm: "none" }, mt: 2 }}>
                <Typography variant="body2" align="center" sx={{ color: "text.secondary" }}>
                    Swipe to see previous/next image
                </Typography>
            </Box>
        </Box>
    );
};

export default InstagramPosts;
