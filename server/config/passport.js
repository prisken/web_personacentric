const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../models');

// Google OAuth Strategy (only if credentials are available)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google OAuth profile:', profile);
    
    // Check if user already exists with this Google ID
    let user = await User.findOne({ where: { google_id: profile.id } });
    
    if (user) {
      console.log('Found existing Google user:', user.email);
      return done(null, user);
    }
    
    // Check if user exists with same email (link accounts)
    if (profile.emails && profile.emails.length > 0) {
      user = await User.findOne({ where: { email: profile.emails[0].value } });
      
      if (user) {
        // Link Google account to existing user
        await user.update({ 
          google_id: profile.id,
          provider: 'google'
        });
        console.log('Linked Google account to existing user:', user.email);
        return done(null, user);
      }
    }
    
    // Create new user
    if (profile.emails && profile.emails.length > 0) {
      user = await User.create({
        google_id: profile.id,
        email: profile.emails[0].value,
        first_name: profile.name?.givenName || 'Google',
        last_name: profile.name?.familyName || 'User',
        provider: 'google',
        is_verified: true, // Google accounts are pre-verified
        subscription_status: 'inactive'
      });
      console.log('Created new Google user:', user.email);
      return done(null, user);
    } else {
      return done(new Error('No email found in Google profile'), null);
    }
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
  }));
  console.log('✅ Google OAuth strategy configured');
} else {
  console.log('⚠️ Google OAuth credentials not found - skipping Google OAuth setup');
}

// Facebook OAuth Strategy (only if credentials are available)
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name', 'first_name', 'last_name']
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Facebook OAuth profile:', profile);
    
    // Check if user already exists with this Facebook ID
    let user = await User.findOne({ where: { facebook_id: profile.id } });
    
    if (user) {
      console.log('Found existing Facebook user:', user.email);
      return done(null, user);
    }
    
    // Check if user exists with same email (link accounts)
    if (profile.emails && profile.emails.length > 0) {
      user = await User.findOne({ where: { email: profile.emails[0].value } });
      
      if (user) {
        // Link Facebook account to existing user
        await user.update({ 
          facebook_id: profile.id,
          provider: 'facebook'
        });
        console.log('Linked Facebook account to existing user:', user.email);
        return done(null, user);
      }
    }
    
    // Create new user
    if (profile.emails && profile.emails.length > 0) {
      user = await User.create({
        facebook_id: profile.id,
        email: profile.emails[0].value,
        first_name: profile.name?.givenName || profile.first_name || 'Facebook',
        last_name: profile.name?.familyName || profile.last_name || 'User',
        provider: 'facebook',
        is_verified: true, // Facebook accounts are pre-verified
        subscription_status: 'inactive'
      });
      console.log('Created new Facebook user:', user.email);
      return done(null, user);
    } else {
      return done(new Error('No email found in Facebook profile'), null);
    }
    
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    return done(error, null);
  }
  }));
  console.log('✅ Facebook OAuth strategy configured');
} else {
  console.log('⚠️ Facebook OAuth credentials not found - skipping Facebook OAuth setup');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
