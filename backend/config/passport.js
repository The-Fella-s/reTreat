const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");
const axios = require("axios");
const User = require("../models/instagramBusinessAccount");
require("dotenv").config();

// Configure Passport to use OAuth2 for Instagram
passport.use(
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
                const user = await User.findOneAndUpdate(
                    { instagramId: userInfo.id },
                    { accessToken, pageAccessToken, igBusinessAccountId, generatedAt: new Date() },
                    { upsert: true, new: true }
                );

                return done(null, user);
            } catch (error) {
                console.error("Error in OAuth2Strategy:", error.message);
                return done(error);
            }
        }
    )
);

module.exports = passport;
