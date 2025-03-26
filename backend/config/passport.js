const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");
const axios = require("axios");
const InstagramUser = require("../models/instagramBusinessAccount");
const SquareUser = require("../models/squareBusinessAccount"); // New model for Square
const { SquareClient, SquareEnvironment } = require("square");
require("dotenv").config();

// Configure Passport to use OAuth2 for Instagram
passport.use(
    "instagram",  // Add strategy name to distinguish between strategies
    new OAuth2Strategy(
        {
            authorizationURL: "https://www.facebook.com/v22.0/dialog/oauth?response_type=code",
            tokenURL: "https://graph.facebook.com/v22.0/oauth/access_token",
            clientID: process.env.INSTAGRAM_APP_ID,
            clientSecret: process.env.INSTAGRAM_APP_SECRET,
            callbackURL: process.env.INSTAGRAM_REDIRECT_URI,
            scope: [
                "instagram_basic",
                "pages_show_list",
                "instagram_content_publish",
                "business_management",
                "pages_read_engagement"
            ],
        },
        async (accessToken, params, profile, done) => {
            try {
                // Fetch user information from Facebook API
                const userResponse = await axios.get("https://graph.facebook.com/v22.0/me", {
                    params: { access_token: accessToken }
                });
                const userInfo = userResponse.data;
                // Fetch user's connected pages
                const pagesResponse = await axios.get("https://graph.facebook.com/v22.0/me/accounts", {
                    params: { access_token: accessToken }
                });
                if (!pagesResponse.data.data.length) {
                    return done(new Error("No connected Facebook pages found"));
                }
                const page = pagesResponse.data.data[0];
                const pageAccessToken = page.access_token;
                const pageId = page.id;
                // Get the Instagram business account linked to the page
                const pageDetailResponse = await axios.get(`https://graph.facebook.com/v22.0/${pageId}`, {
                    params: { fields: "instagram_business_account", access_token: pageAccessToken }
                });
                if (!pageDetailResponse.data.instagram_business_account) {
                    return done(new Error("No linked Instagram Business Account found"));
                }
                const igBusinessAccountId = pageDetailResponse.data.instagram_business_account.id;
                // Save or update user token in MongoDB
                const user = await InstagramUser.findOneAndUpdate(
                    { instagramId: userInfo.id },
                    { accessToken, pageAccessToken, igBusinessAccountId, generatedAt: new Date() },
                    { upsert: true, new: true }
                );
                return done(null, user);
            } catch (error) {
                console.error("Error in Instagram OAuth2Strategy:", error.message);
                return done(error);
            }
        }
    )
); 

// Configure Passport to use OAuth2 for Square
passport.use(
    "square",
    new OAuth2Strategy(
        {
            authorizationURL: "https://connect.squareupsandbox.com/oauth2/authorize",
            tokenURL: "https://connect.squareupsandbox.com/oauth2/token",
            clientID: process.env.SQUARE_APPLICATION_ID,
            clientSecret: process.env.SQUARE_APPLICATION_SECRET,
            callbackURL: process.env.SQUARE_REDIRECT_URI,
            passReqToCallback: true,
            customHeaders: {
                "Square-Version": "2024-01-18"
            },
            skipUserProfile: false
        },
        async (req, accessToken, refreshToken, params, profile, done) => {
            try {
                console.log("OAuth Verification Started");
                console.log("Access Token:", accessToken);
                console.log("Refresh Token:", refreshToken);
                console.log("Params:", params);

                // Verify the access token directly with Square
                const verificationResponse = await axios.get('https://connect.squareupsandbox.com/v2/merchants/me', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Square-Version': '2024-01-18'
                    }
                });

                const merchantInfo = verificationResponse.data.merchant;
                console.log("Merchant Info:", merchantInfo);

                // Calculate token expiration
                const expiresIn = params.expires_in ? parseInt(params.expires_in) : 3600;
                const expiresAt = new Date(Date.now() + (expiresIn * 1000));

                // Save or update merchant token in MongoDB
                const user = await SquareUser.findOneAndUpdate(
                    { merchantId: merchantInfo.id },
                    { 
                        accessToken,
                        refreshToken,
                        merchantName: merchantInfo.business_name || 'Unknown Business',
                        merchantId: merchantInfo.id,
                        expiresAt: expiresAt,
                        generatedAt: new Date(),
                        userId: req.session?.userId || null
                    },
                    { 
                        upsert: true, 
                        new: true,
                        runValidators: true 
                    }
                );

                console.log("User saved successfully");
                return done(null, user);
            } catch (error) {
                console.error("OAuth Verification Error:");
                console.error("Error Response:", error.response ? error.response.data : 'No response data');
                console.error("Error Message:", error.message);
                console.error("Full Error:", error);
                return done(error);
            }
        }
    )
);


// Serialize and deserialize user for sessions (if you're using sessions)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // Try to find in Instagram users first
        let user = await InstagramUser.findById(id);
        if (!user) {
            // If not found, try Square users
            user = await SquareUser.findById(id);
        }
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
